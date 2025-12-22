import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../store/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearSession, isTokenExpired, persistAuthHeader } from "../../utils/auth";
import useAuthSession from "../../hooks/useAuthSession";
import { clearAdvisors } from "../../../store/reducers/advisorsReducers";
import { clearCoordAdvisors } from "../../../store/reducers/coordAdvisorsReducers";

const iconPath = {
  mail: "M4 4h16v16H4z M22 6l-10 7L2 6",
  phone: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.62-3.92A19.5 19.5 0 013.08 9.2 19.79 19.79 0 010 0.19 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6 7s1.5 4 5 7 7 5 7 5l1.36-1.36a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92Z",
  map: "M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z M9 5v14 M15 5v14",
  cash: "M12 8a3 3 0 013 3v2a3 3 0 11-6 0v-1M12 18h0",
  user: "M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z",
  building: "M3 21h18M6 21V5h12v16M9 9h6M9 13h6M9 17h6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
};

const Icon = ({ name, size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <path d={iconPath[name]} />
  </svg>
);

const roleStorage = localStorage.getItem("auth_user") ? JSON.parse(localStorage.getItem("auth_user")) : null;
const role = roleStorage?.rol || "COORDINACION";
console.log(role, "roleando");

const InfoCard = ({ icon, label, value, highlight, small }) => (
  <div
    className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${highlight ? "bg-white/15 border border-white/20" : "hover:bg-white/10"
      }`}
  >
    <div className={`p-2 rounded-lg ${highlight ? "bg-white/25 text-white" : "bg-white/15 text-white"}`}>
      <Icon name={icon} size={16} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-white/80 font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p
        className={`font-semibold text-white ${highlight ? "text-lg" : "text-sm"} ${small ? "text-xs" : ""} truncate`}
        title={value}
      >
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default function SideBar() {
  const [profile, setProfile] = useState({ asesor: {}, coordinador: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useAuthSession();
  const userId = user?.id;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Sin sesión activa");
      return;
    }
    if (isTokenExpired(token)) {
      clearSession();
      setLoading(false);
      setError("Sesión expirada");
      return;
    }

    persistAuthHeader(token);

    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        setError("Sin sesión activa");
        return;
      }
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(`${api}/api/users/profile/${userId}`);
        setProfile(data || {});
      } catch (err) {
        const msg = err?.response?.data?.error || err?.message || "No se pudo cargar el perfil";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, userId]);

  const asesor = profile?.asesor || {};
  const coord = profile?.coordinador || {};
  console.log("Profile ", profile);

  const stored = localStorage.getItem("auth_user");
  const parsed = stored ? JSON.parse(stored) : {};

  const org_unit_id = parsed?.org_unit_id || "";
  const userInfo = {
    name: asesor.name || "Usuario Movilco",
    email: asesor.email || "usuario@movilco.com",
    phone: asesor.phone || "000 000 0000",
    district: asesor.district || "Distrito N/D",
    regional: asesor.regional || "Regional N/D",
    budget: asesor.presupuesto ? `${asesor.presupuesto}` : "Presupuesto N/D",
  };
  console.log("SideBar", userInfo);


  const bossInfo = {
    name: coord.name || "Jefe no asignado",
    email: coord.email || "jefe@movilco.com",
    district: coord.district || "Distrito N/D",
    cargo: coord.cargo || "Cargo N/D",
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${api}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error", err?.response?.data || err?.message);
    } finally {
      clearSession();
      dispatch(clearAdvisors());
      dispatch(clearCoordAdvisors());
      navigate("/SignIn");
    }
  };

  return (
    <aside
      className="hidden lg:flex flex-col red-movilco text-white h-screen sticky top-0 border-r border-red-800/60 shadow-lg z-40 font-sans overflow-hidden"
      style={{ width: "320px", minWidth: "320px" }}
    >
      <div className="flex-1 flex flex-col p-8 ">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-3xl shadow-inner border border-white/30">
              {userInfo.name.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 bg-green-400 w-6 h-6 rounded-full border-2 border-red-700 shadow-sm" title="Activo" />
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-1 text-white">{userInfo.name}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full border border-white/20 text-white">
            <Icon name="user" size={14} className="text-white" />
            <span className="text-xs font-medium tracking-wide uppercase">{userInfo.regional}</span>
          </div>
        </div>

        <div className="space-y-4 w-full">
          {loading && (
            <div className="text-xs text-white bg-white/10 px-3 py-2 rounded-lg border border-white/10">Cargando perfil...</div>
          )}
          {error && (
            <div className="text-xs text-white bg-red-500/30 px-3 py-2 rounded-lg border border-red-400/40">{error}</div>
          )}
          <InfoCard icon="map" label="Distrito" value={userInfo.district} />

            <InfoCard icon="cash" label="Presupuesto" value={userInfo.budget} highlight />

          <div className="h-px bg-white/20 my-4 mx-2" />
          <InfoCard icon="mail" label="Correo" value={userInfo.email} small />
          <InfoCard icon="phone" label="Telefono" value={userInfo.phone} />
        </div>
      </div>

      <div className="p-6 red-movilco border-t text-white border-red-800/60">
        {asesor.jerarquia === "ASESORIA" && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <Icon name="user" size={14} className="text-white" /> <span>Jefe Directo</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:border-white/30 transition-colors group shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  {bossInfo.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate text-white group-hover:text-red-100 transition-colors">
                    {bossInfo.name}
                  </p>
                  <p className="text-xs text-white/80 truncate">{bossInfo.cargo}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Icon name="building" size={12} className="opacity-70 text-white" />
                  <span className="truncate">{bossInfo.district}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Icon name="mail" size={12} className="opacity-70 text-white" />
                  <span className="truncate">{bossInfo.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}


        <button
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all border border-white/20 shadow-sm group"
          onClick={handleLogout}
        >
          <Icon name="logout" size={18} className="group-hover:text-red-100 transition-colors" />
          <span className="font-medium text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
