import { useCallback, useEffect, useState } from "react";
import { clearSession, getStoredToken, getStoredUser, isTokenExpired, persistAuthHeader } from "../utils/auth";

const normalizeRole = (user) => {
  const raw = user?.role || user?.cargo || "";
  return raw ? String(raw).trim().toUpperCase() : "";
};

const hydrate = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return {
    token,
    user,
    role: normalizeRole(user)
  };
};

export default function useAuthSession() {
  const [session, setSession] = useState(() => hydrate());

  const refresh = useCallback(() => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && isTokenExpired(token)) {
      clearSession();
      setSession({ token: "", user: {}, role: "" });
      return;
    }

    if (token) {
      persistAuthHeader(token);
    }

    setSession({
      token,
      user,
      role: normalizeRole(user)
    });
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener("auth-changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("auth-changed", handler);
    };
  }, [refresh]);

  return { ...session, refresh };
}
