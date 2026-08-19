import axios, { AxiosInstance } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';

type GetAccessTokenSilently = () => Promise<string>;
type Logout = () => void;

export const createApiInstance = (
  getAccessTokenSilently: GetAccessTokenSilently,
  logout: Logout
): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err: any) {
      if (err?.error !== 'login_required') {
        throw new Error(`Unexpected Auth0 error: ${err}`);
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status;

      if (status === 401) {
        void logout();
        return;
      }

      return Promise.reject(err);
    },
  );

  return instance;
};

export const useApi = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  return useMemo(
    () => createApiInstance(getAccessTokenSilently, logout),
    [getAccessTokenSilently, logout]
  );
};
