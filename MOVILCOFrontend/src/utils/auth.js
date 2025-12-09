const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const decodePayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded || {};
  } catch (e) {
    return {};
  }
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = decodePayload(token);
  if (!exp) return false; // si no hay exp, asumimos válido hasta que el backend responda
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete window?.axios?.defaults?.headers?.common?.Authorization;
};

export const persistAuthHeader = (token) => {
  if (token && window?.axios) {
    window.axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const hasValidSession = () => {
  const token = getStoredToken();
  return Boolean(token) && !isTokenExpired(token);
};

export const setupAuthFromStorage = () => {
  const token = getStoredToken();
  if (token && !isTokenExpired(token)) {
    persistAuthHeader(token);
    return true;
  }
  clearSession();
  return false;
};

export const authKeys = { TOKEN_KEY, USER_KEY };
