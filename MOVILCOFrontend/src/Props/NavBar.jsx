import { useMemo, useState } from "react";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import useAuthSession from "../hooks/useAuthSession";

const NAV_ITEMS = [
  { id: "dashboardAsesores", label: "Dashboard", link: "/AdvisorDashboard" },
  { id: "asesores", label: "Asesores", link: "/Advisors" },
  { id: "coordinadores", label: "Coordinadores", link: "/Coordinators" },
  { id: "gerentes", label: "Gerentes", link: "/RegionalManager" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState("asesores");
  const [selectedNav, setSelectedNav] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { role: sessionRole } = useAuthSession();

  const userRole = useMemo(() => {
    return sessionRole || "";
  }, [sessionRole]);

  const visibleNavItems = useMemo(() => {
    if (["ASESOR", "ASESORIA", "ASESOR COMERCIAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => item.id === "dashboardAsesores");
    }
    if (["COORDINACION", "COORDINADOR COMERCIAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => ["asesores", ].includes(item.id));
    }
    if (["DIRECCION", "DIRECTOR COMERCIAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => [ "coordinadores"].includes(item.id));
    }
    if (["GERENTE", "GERENCIA", "DIRECTOR", "DIRECTOR REGIONAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => [ "gerentes"].includes(item.id));
    }
    return NAV_ITEMS;
  }, [userRole]);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 inline-flex items-center justify-center rounded-md text-slate-600 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Abrir men\u00fa"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:items-center lg:ml-6 space-x-2 w-full justify-end px-4 py-2 rounded-lg font-medium text-slate-600 transition-colors">
            {visibleNavItems.map((item) => {
              const active = activeId === item.id;
              const classes = active ? "bg-red-50 text-[#cc0000]" : "hover:bg-red-50 hover:text-[#cc0000]";

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
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-2 space-y-1 rounded-lg border border-slate-200 bg-white shadow-sm p-2">
            {visibleNavItems.map((item) => {
              const active = activeId === item.id;
              const classes = active ? "bg-red-50 text-[#cc0000]" : "hover:bg-red-50 hover:text-[#cc0000]";
              return (
                <NavLink
                  key={item.id}
                  to={item.link ?? "#"}
                  className={`block px-3 py-2 rounded transition-colors ${classes}`}
                  onClick={() => {
                    setActiveId(item.id);
                    setSelectedNav(selectedNav === item.id ? null : item.id);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
