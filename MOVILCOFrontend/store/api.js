import axios from "axios";

// Base URL que ya usan otros modulos
export const api = "https://api.movilco.devmauricioy.com";

// Cliente HTTP reutilizable (axios) con baseURL configurada
const apiClient = axios.create({
  baseURL: api,
  withCredentials: true,
});

export default apiClient;
