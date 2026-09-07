import { useState } from "react";
import { toast } from "sonner";
import {
  getVehiclesWithHousesQuery,
  type VehicleWithHouse,
} from "../../api/vehicles";

import {
  TruckIcon,
  HomeIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { RecentVehicles } from "./recentVehicles";
import { VisitorRegisterModal } from "../visitors/visitorRegisterModal";

export default function GuardSearch() {
  // const { user, profile, signOut, } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<VehicleWithHouse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegisterVehicleOpen, setIsRegisterVehicleOpen] = useState(false);

  const searchVehicle = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const { data, error } = await getVehiclesWithHousesQuery()
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
    <>
      <VisitorRegisterModal
        onOpenChange={setIsRegisterVehicleOpen}
        open={isRegisterVehicleOpen}
      />
      <div className="space-y-4 w-full rounded-2xl ">
        <header className="bg-[#2d4a3e] text-white sticky top-0 z-30 shadow-md">
          <div className="px-4 py-3.5 bg-[#2d4a3e] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold  tracking-wider text-emerald-200/90">
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
                <MagnifyingGlassIcon className="size-6" />
              </div>

              <input
                type="text"
                placeholder="Escribe la placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-9 py-2.5 text-lg font-bold tracking-wider  bg-[#fafbfa] border-2 border-[#344c3d] rounded-2xl focus:ring-4 focus:ring-[#344c3d]/20 focus:outline-none focus:bg-white text-stone-900 transition"
                required
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setResult(null);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#344c3d] hover:bg-[#2d4a3e] active:bg-[#233930] text-white font-semibold px-4 py-2.5 rounded-2xl text-sm flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
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
                  <CheckCircleIcon className="size-10" />
                  <div>
                    <div className="text-[11px] font-bold  tracking-wider text-emerald-200/90 leading-tight">
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
                <div className="flex items-center justify-between bg-[#f8faf8] p-3 rounded-2xl border border-stone-200">
                  <div>
                    <span className="block text-[11px] font-bold  text-stone-400 tracking-wider">
                      Placa Registrada
                    </span>
                    <div className="mt-1 inline-flex items-center bg-white border border-stone-800 rounded px-3 py-1 text-stone-900 font-mono text-xl font-black tracking-widest shadow-inner">
                      {result.license_plate}
                    </div>
                  </div>
                  {result.vehicle_type === "visitor" && (
                    <div className="text-right">
                      <span className="block text-[11px] font-semibold text-stone-400 ">
                        Visitante
                      </span>
                      <span className="text-xs font-bold text-stone-800 block mt-1">
                        {result.visitor_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-white border border-stone-200/70 shadow-sm">
                  <div className="bg-[#eef4f0] p-2 rounded-lg text-[#2d4a3e] border border-[#c5d7cc] shrink-0">
                    <TruckIcon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-bold  tracking-wider text-stone-400">
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
                  <HomeIcon className="size-4" />
                  <h2 className="text-xs font-bold  tracking-wider text-stone-700">
                    Información de la Casa
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#f8faf8] p-3 rounded-2xl border border-stone-200/80">
                    <span className="block text-[11px] font-semibold text-stone-400 ">
                      Casa No.
                    </span>
                    <span className="text-xl font-black text-stone-900 tracking-tight">
                      {result.houses.house_number}
                    </span>
                  </div>
                  <div className="bg-[#f8faf8] p-3 rounded-2xl border border-stone-200/80">
                    <span className="block text-[11px] font-semibold text-stone-400 ">
                      Tipo Usuario
                    </span>
                    <span className="text-sm font-bold text-stone-800 inline-flex items-center mt-1">
                      {result.vehicle_type === "visitor"
                        ? "Visita Autorizada"
                        : "Residente"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#f8faf8] border border-stone-200/80 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] font-semibold text-stone-400 ">
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

                <div className="p-3 rounded-2xl bg-[#f3f7f4] border border-[#cbe0d3] flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] font-semibold text-[#344c3d] ">
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
          <RecentVehicles
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            setResult={setResult}
          />
        )}
        <button
          className="p-3 box-border w-full bg-[#344e41] text-white border-none rounded-2xl text-base font-bold cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsRegisterVehicleOpen(true)}
        >
          Registro de Vehículo de Visitante
        </button>
      </div>
    </>
  );
}
