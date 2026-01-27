import { useMemo, useState } from "react";
import Logo from "./Logo";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthSession from "../hooks/useAuthSession";
import { clearSession, getStoredUser } from "../utils/auth";
import axios from "axios";
import { api } from "../../store/api";

const NAV_ITEMS = [
  { id: "dashboardAsesores", label: "Dashboard", link: "/AdvisorDashboard" },
  { id: "asesores", label: "Asesores", link: "/Advisors" },
  { id: "coordinadores", label: "Coordinadores", link: "/Coordinators" },
  { id: "gerentes", label: "Gerentes", link: "/RegionalManager" },
  { id: "recreoCoordinadores", label: "Recreo coordinadores", link: "/WeeklyCoordinatorPage" },
  { id: "noveltiesRh", label: "Novedades", link: "/novedades-rh" },
  { id: "budgetsRh", label: "Presupuesto", link: "/presupuesto-rh" },
  { id: "userManagerRh", label: "Usuarios", link: "/usuarios-rh" },
  { id: "manualDaysRh", label: "Dias Laborados", link: "/manual-days-rh" },
  { id: "sendMails", label: "Enviar correos", link: "/sendmails" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState("asesores");
  const [selectedNav, setSelectedNav] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { role: sessionRole } = useAuthSession();
  const navigate = useNavigate();

  const userRole = useMemo(() => {
    return sessionRole || "";
  }, [sessionRole]);

  const storedUser = useMemo(() => getStoredUser() || {}, []);
  const userName = storedUser.name || storedUser.full_name || "Usuario";
  const userEmail = storedUser.email || "usuario@movilco.com";
  const userDistrict = storedUser.district || storedUser.regional || storedUser.unit || "";
  const userPhone = storedUser.phone || "";
  const initials = (userName || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "U";

  const visibleNavItems = useMemo(() => {
    if (userRole === "ADMIN") {
      return NAV_ITEMS.filter((item) => ["noveltiesRh", "userManagerRh", "budgetsRh", "manualDaysRh","sendMails"].includes(item.id));
    }
    if (["ASESOR", "ASESORIA", "ASESOR COMERCIAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => item.id === "dashboardAsesores");
    }
    if (["COORDINACION", "COORDINADOR COMERCIAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => ["asesores"].includes(item.id));
    }
    if (["DIRECCION", "DIRECTOR COMERCIAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => ["coordinadores"].includes(item.id));
    }
    if (["GERENTE", "GERENCIA", "DIRECTOR", "DIRECTOR REGIONAL"].includes(userRole)) {
      return NAV_ITEMS.filter((item) => ["gerentes"].includes(item.id));
    }
    return NAV_ITEMS.filter((item) => !["noveltiesRh", "userManagerRh", "manualDaysRh","sendMails"].includes(item.id));
  }, [userRole]);

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error", err?.response?.data || err?.message);
    } finally {
      clearSession();
      navigate("/SignIn");
    }
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-6 xl:px-8 lg:max-w-[calc(100vw-18rem)] xl:max-w-[calc(100vw-20rem)] 2xl:max-w-7xl">
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
          <div className="lg:hidden mt-2 space-y-3 rounded-lg border border-slate-200 bg-white shadow-sm p-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                <p className="text-[11px] text-slate-600 truncate">
                  {userRole || "Rol N/D"} {userDistrict ? `• ${userDistrict}` : ""}
                </p>
                {userEmail && <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>}
                {userPhone && <p className="text-[11px] text-slate-500 truncate">{userPhone}</p>}
              </div>
            </div>

            <div className="space-y-1">
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

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5m0 0v-5m0 5-6.293-6.293a1 1 0 00-.707-.293H9a2 2 0 01-2-2V7m0 0a2 2 0 012-2h3.586a1 1 0 01.707.293L15 6m-8 1h.01" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
