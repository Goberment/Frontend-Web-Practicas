import axios from 'axios';

export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const cliente = axios.create({
  baseURL: URL_API,
  timeout: 5000,
});

export default cliente;
