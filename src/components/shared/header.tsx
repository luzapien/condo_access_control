import { useAuth } from "../../context/authContext";
import { UserCircleIcon } from "@heroicons/react/24/outline";
export function Header() {
  const { profile, signOut } = useAuth();


return (
  <header className="bg-[#2d4a3e] text-white sticky top-0 z-30 shadow-md">
    <div className="px-4 py-3.5 flex items-center justify-between">
      <div>
        <div className="text-[11px] font-bold tracking-wider text-emerald-200/90">
          COTO PARQUE ARRAYANES 6
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight leading-tight">
          Puerta de Seguridad
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border-l border-emerald-700/50 pl-3">
          <UserCircleIcon className="size-8 text-emerald-200" />
          <div className="flex flex-col text-right gap-2">
            <span className="text-xs font-medium text-emerald-100 truncate max-w-100px">
              {profile?.name}
            </span>
            <button onClick={signOut} className="text-[11px] text-red-300  text-center transition-colors border rounded-2xl">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  );
}
