import { useEffect, useState } from "react";
import {
  getVehiclesWithHousesQuery,
  type VehiclesWithHouses,
  type VehicleWithHouse,
} from "../../api/vehicles";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";

interface RecentVehiclesProps {
  setSearchTerm: (params: string) => void;
  setResult: (params: VehicleWithHouse) => void;
  searchTerm: string;
}

export function RecentVehicles({
  setSearchTerm,
  setResult,
}: RecentVehiclesProps) {
  const [recentVehicles, setRecentVehicles] = useState<VehiclesWithHouses>([]);
  
  useEffect(() => {
    let cancelled = false;

    const loadRecentVehicles = async () => {
      const { data, error } = await getVehiclesWithHousesQuery()
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

  return (
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
            const formattedTime = new Date(item.created_at).toLocaleString();

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
                  setResult({
                    ...item,
                    houses: Array.isArray(item.houses)
                      ? item.houses[0]
                      : item.houses,
                  });
                }}
                className="p-4 hover:bg-[#fafbfa] transition flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="bg-[#eef4f0] p-1 rounded-xl text-[#2d4a3e] border border-[#c5d7cc] shrink-0 mt-0.5">
                    <DocumentCheckIcon className="size-6" />
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
  );
}
