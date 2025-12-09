import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import StandardLayout from "./StandardLayout";
import { hasValidSession, setupAuthFromStorage, clearSession } from "../utils/auth";

const ProtectedLayout = () => {
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const ok = setupAuthFromStorage();
    setValid(ok && hasValidSession());
    setReady(true);
  }, []);

  const content = useMemo(() => {
    if (!ready) return null;
    if (!valid) {
      clearSession();
      return <Navigate to="/SignIn" replace />;
    }
    return <StandardLayout />;
  }, [ready, valid]);

  return content;
};

export default ProtectedLayout;
