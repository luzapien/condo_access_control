import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  vehiclesWithHousesQuery,
  type VehiclesWithHouses,
  type VehicleWithHouse,
} from "../../api/vehicles";

export default function GuardSearch() {
  // const { user, profile, signOut, } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<VehicleWithHouse | null>(null);
  const [recentVehicles, setRecentVehicles] = useState<VehiclesWithHouses>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRecentVehicles = async () => {
      const { data, error } = await vehiclesWithHousesQuery
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error al cargar recientes:", error);
      } else if (!cancelled) {
        setRecentVehicles(data);
      }
    };

    void loadRecentVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  const searchVehicle = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const { data, error } = await vehiclesWithHousesQuery

      .ilike("license_plate", `%${searchTerm.trim()}%`)
      .maybeSingle();

    if (error) {
      setError("Error al buscar en la base de datos.");
      toast.error("Error al realizar la búsqueda.");
      console.error(error);
    } else if (!data) {
      setError("No se encontró ningún vehículo con esa placa.");
    } else {
      setResult({
        ...data,
        houses: Array.isArray(data.houses) ? data.houses[0] : data.houses,
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 w-full">
      <header className="bg-[#2d4a3e] text-white sticky top-0 z-30 shadow-md">
        <div className="px-4 py-3.5 bg-[#2d4a3e] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200/90">
              COTO PARQUE ARRAYANES 6
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
              Puerta de Seguridad
            </h1>
          </div>
        </div>
      </header>
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
        <label className="block text-lg font-bold  tracking-wider text-stone-700 mb-1.5">
          Buscador de Vehículos
        </label>

        <form onSubmit={searchVehicle} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <input
              type="text"
              placeholder="Escribe la placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-9 py-2.5 text-lg font-bold tracking-wider  bg-[#fafbfa] border-2 border-[#344c3d] rounded-xl focus:ring-4 focus:ring-[#344c3d]/20 focus:outline-none focus:bg-white text-stone-900 transition"
              required
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#344c3d] hover:bg-[#2d4a3e] active:bg-[#233930] text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
          >
            <span>{loading ? "Buscando..." : "Buscar"}</span>
          </button>
        </form>
      </section>

      {error && (
        <p className="text-center text-red-600 font-semibold text-sm">
          {error}
        </p>
      )}

      {result ? (
        <>
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div
              className={`px-4 py-3 flex items-center justify-between text-white shadow-inner ${result.vehicle_type === "visitor" ? "bg-blue-600" : "bg-[#2d4a3e]"}`}
            >
              <div className="flex items-center space-x-2.5">
                <div className="bg-white text-stone-900 p-1.5 rounded-full shadow-sm">
                  <svg
                    className="w-5 h-5 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-200/90 leading-tight">
                    Estado Oficial
                  </div>
                  <div className="text-base font-extrabold tracking-tight">
                    {result.vehicle_type === "visitor"
                      ? "VEHÍCULO DE VISITANTE"
                      : "VEHÍCULO DE RESIDENTE"}
                  </div>
                </div>
              </div>
              <span className="bg-black/20 border border-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded  tracking-wide">
                Autorizado
              </span>
            </div>

            <div className="p-4 space-y-3.5 bg-linear-to-b from-white to-[#f7f9f7]/50">
              <div className="flex items-center justify-between bg-[#f8faf8] p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="block text-[11px] font-bold uppercase text-stone-400 tracking-wider">
                    Placa Registrada
                  </span>
                  <div className="mt-1 inline-flex items-center bg-white border border-stone-800 rounded px-3 py-1 text-stone-900 font-mono text-xl font-black tracking-widest shadow-inner">
                    {result.license_plate}
                  </div>
                </div>
                {result.vehicle_type === "visitor" && (
                  <div className="text-right">
                    <span className="block text-[11px] font-semibold text-stone-400 uppercase">
                      Visitante
                    </span>
                    <span className="text-xs font-bold text-stone-800 block mt-1">
                      {result.visitor_name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-white border border-stone-200/70 shadow-sm">
                <div className="bg-[#eef4f0] p-2.5 rounded-lg text-[#2d4a3e] border border-[#c5d7cc] shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 17a2 2 0 104 0 2 2 0 00-4 0zm8 0a2 2 0 104 0 2 2 0 00-4 0zM5 11l2-5h10l2 5m-14 0h14m-14 0a2 2 0 00-2 2v4a1 1 0 001 1h1m13-7a2 2 0 012 2v4a1 1 0 01-1 1h-1"
                    ></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Vehículo
                  </span>
                  <p className="text-base font-bold text-stone-900 truncate">
                    {result.brand || "No especificada"} {result.model || ""}
                  </p>
                  <p className="text-xs text-stone-600 font-medium flex items-center gap-1.5 mt-0.5">
                    Color: {result.color || "No registrado"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-[#f8faf8] px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-[#344c3d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Información de la Casa
                </h2>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8faf8] p-3 rounded-xl border border-stone-200/80">
                  <span className="block text-[11px] font-semibold text-stone-400 uppercase">
                    Casa No.
                  </span>
                  <span className="text-xl font-black text-stone-900 tracking-tight">
                    {result.houses.house_number}
                  </span>
                </div>
                <div className="bg-[#f8faf8] p-3 rounded-xl border border-stone-200/80">
                  <span className="block text-[11px] font-semibold text-stone-400 uppercase">
                    Tipo Usuario
                  </span>
                  <span className="text-sm font-bold text-stone-800 inline-flex items-center mt-1">
                    {result.vehicle_type === "visitor"
                      ? "Visita Autorizada"
                      : "Residente"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f8faf8] border border-stone-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-semibold text-stone-400 uppercase">
                    Propietario / Residente
                  </span>
                  <span className="text-base font-bold text-stone-900 block">
                    {result.houses.owner}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#e1ebe5] border border-[#c5d7cc] flex items-center justify-center font-bold text-xs text-[#2d4a3e]">
                  {result.houses.owner.substring(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f3f7f4] border border-[#cbe0d3] flex items-center justify-between">
                <div>
                  <span className="block text-[11px] font-semibold text-[#344c3d] uppercase">
                    Teléfono
                  </span>
                  <span className="text-base font-mono font-bold text-stone-900 tracking-wider">
                    {result.houses.phone || "No registrado"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="bg-[#f8faf8] px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-[#344c3d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Últimos Registros
              </h2>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {recentVehicles.length === 0 ? (
              <p className="p-4 text-xs text-stone-400 text-center">
                No hay registros recientes.
              </p>
            ) : (
              recentVehicles.map((item) => {
                const formattedTime = new Date(
                  item.created_at,
                ).toLocaleString();

                let badgeColor =
                  "bg-emerald-100 text-emerald-800 border-emerald-200";
                let labelText = "INGRESÓ " + formattedTime;

                if (item.vehicle_type === "visitor") {
                  badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
                  labelText = "VISITANTE " + formattedTime;
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSearchTerm(item.license_plate);
                      setResult(item);
                    }}
                    className="p-4 hover:bg-[#fafbfa] transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="bg-[#eef4f0] p-2.5 rounded-xl text-[#2d4a3e] border border-[#c5d7cc] shrink-0 mt-0.5">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 17a2 2 0 104 0 2 2 0 00-4 0zm8 0a2 2 0 104 0 2 2 0 00-4 0zM5 11l2-5h10l2 5m-14 0h14m-14 0a2 2 0 00-2 2v4a1 1 0 001 1h1m13-7a2 2 0 012 2v4a1 1 0 01-1 1h-1"
                          ></path>
                        </svg>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center bg-white border border-stone-800 rounded px-2 py-0.5 text-stone-900 font-mono text-sm font-bold tracking-wider shadow-inner">
                            {item.license_plate}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-stone-900">
                          {item.brand || "Vehículo"} {item.model || ""} •{" "}
                          <span className="text-stone-600 font-normal">
                            Color: {item.color || "N/D"}
                          </span>
                        </p>

                        <p className="text-xs text-stone-500 font-medium">
                          Destino:{" "}
                          <strong className="text-stone-800">
                            Casa {item.houses?.house_number}
                          </strong>{" "}
                          •{" "}
                          {item.vehicle_type === "visitor"
                            ? `Visita: ${item.visitor_name}`
                            : "Residente"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-1 rounded-md border uppercase tracking-wider ${badgeColor}`}
                      >
                        {labelText}
                      </span>
                      <svg
                        className="w-4 h-4 text-stone-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
