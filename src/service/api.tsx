import axios from 'axios';
import Cookies from 'universal-cookie';

export const api = axios.create({
  baseURL: process.env.REACT_APP_PORT_PROJECT_BACKEND,
});

// Função para adicionar o token aos cabeçalhos
export const addTokenToHeaders = (config: any) => {
  const cookie = new Cookies();
  const Token = cookie.get('@feminicidio_token'); // Sem necessidade de await, get é síncrono
  if (Token) {
    config.headers.Authorization = `Bearer ${Token}`;
  }
  return config;
};

// Interceptor para adicionar o token antes de cada requisição
api.interceptors.request.use(addTokenToHeaders, (error) => {
  return Promise.reject(error);
});

export default api;
