// config/apiClient.ts para React Native
import axios from "axios";
import { ACCESS_TOKEN_KEY, urlServer } from "../config/config";
import storage from '../lib/storage';

const apiClient = axios.create({
    baseURL: urlServer,
    timeout: 30000, // 30 segundos de timeout para móvil
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Función para obtener token de Storage con fallback
const getToken = async (): Promise<string | null> => {
    try {
        return await storage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token from store:', error);
        return null;
    }
};

// Log condicional para desarrollo
const logOnDev = (message: string, log?: any) => {
    if (__DEV__) { // __DEV__ es la variable global de React Native para modo desarrollo
        console.log(message, log);
    }
};

// Request interceptor
apiClient.interceptors.request.use(
    async (request) => {
        const { method, url } = request;

        // Obtener token de AsyncStorage
        const authToken = await getToken();

        if (authToken) {
            request.headers['Authorization'] = `Bearer ${authToken}`;
        }

        // Log en desarrollo
        logOnDev(`[${method?.toUpperCase()}] ${url} | Request`, request);

        return request;
    },
    (error) => {
        logOnDev(`Request Error:`, error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        const { method, url } = response.config;
        const { status } = response;

        logOnDev(`[${method?.toUpperCase()}] ${url} | Response ${status}`, response);

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Manejo específico de errores de red
        if (error.code === 'ECONNABORTED') {
            logOnDev('Request timeout', error);
            return Promise.reject({
                ...error,
                message: 'La solicitud ha excedido el tiempo de espera'
            });
        }

        if (!error.response) {
            // Error de red (sin conexión)
            logOnDev('Network Error', error);
            return Promise.reject({
                ...error,
                message: 'Error de conexión. Verifica tu red.'
            });
        }

        const { message } = error;
        const { status, data } = error.response;
        const { method, url } = error.config;

        logOnDev(`[${method?.toUpperCase()}] ${url} | Error ${status} ${data?.message || ''} | ${message}`, error);

        // Manejo de token expirado (401)
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Aquí puedes implementar lógica de refresh token
                // const newToken = await refreshToken();
                // await AsyncStorage.setItem(ACCESS_TOKEN_KEY, newToken);
                // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                // return apiClient(originalRequest);
            } catch (refreshError) {
                // Si no se puede refrescar, redirigir al login
                // Nota: No podemos navegar directamente desde aquí
                // Deberías emitir un evento o usar un store global
                logOnDev('Refresh token failed', refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;