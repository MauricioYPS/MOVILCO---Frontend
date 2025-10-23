// ...existing code...
import { useState } from "react";
import Logo from "./Logo";
import {NavLink} from "react-router-dom";

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",            icon: "speedometer-outline", link: "/" },
  { id: "asesores",   label: "Asesores",             icon: "people-outline", link: "/Advisors" },
  { id: "coordinadores", label: "Coordinadores",     icon: "person-circle-outline" },
  { id: "directores", label: "Directores",           icon: "star-outline" },
  { id: "metas",      label: "Registro Metas",       icon: "cloud-upload-outline" },
  { id: "historial",  label: "Historial y Reportes", icon: "archive-outline" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState("dashboard");
  const [selectedNav, setSelectedNav] = useState(null);

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Izquierda: Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Centro: Navegación Principal */}
          <div className={" sm:flex sm:items-center sm:ml-6 space-x-2 flex justify-around  w-full items-center px-4 py-2 rounded-lg font-medium text-slate-600 transition-colors"

          }>
            {NAV_ITEMS.map((item) => {
              const active = activeId === item.id;
              const classes = active
                ? "bg-red-50 text-[#cc0000]"
                : "hover:bg-red-50 hover:text-[#cc0000]";

              return (
                <NavLink
                  key={item.id}
                  to={item.link ?? "#"}
                  className={`px-3 py-2 rounded transition-colors ${classes}`}
                  onClick={() => {
                    setActiveId(item.id);
                    setSelectedNav(selectedNav === item.id ? null : item.id);
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Derecha: (vacío por ahora) */}
          <div className="flex items-center" />
        </div>
      </div>
    </nav>
  );
}
// ...existing code...