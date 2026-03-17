import { Platform } from 'react-native';

// Importamos AsyncStorage de forma segura para evitar "Native module is null"
let AsyncStorage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
} | null = null;

try {
    // Solo intentamos importar si no estamos en la web
    if (Platform.OS !== 'web') {
        AsyncStorage = require('@react-native-async-storage/async-storage').default;
    }
} catch {
    // Si falla la importación, AsyncStorage se queda en null
    // y usaremos localStorage de fallback
}

/**
 * Una capa de almacenamiento robusta que detecta el entorno
 * y usa la mejor opción disponible.
 */
const storage = {
    async getItem(key: string): Promise<string | null> {
        try {
            // Opción 1: AsyncStorage nativo (Android/iOS)
            if (AsyncStorage !== null) {
                return await AsyncStorage.getItem(key);
            }
            // Opción 2: localStorage del navegador (Web)
            if (typeof window !== 'undefined' && window.localStorage) {
                return window.localStorage.getItem(key);
            }
            return null;
        } catch (error) {
            console.warn(`storage.getItem("${key}") failed, trying localStorage:`, error);
            try {
                return window?.localStorage?.getItem(key) ?? null;
            } catch {
                return null;
            }
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        try {
            // Opción 1: AsyncStorage nativo
            if (AsyncStorage !== null) {
                await AsyncStorage.setItem(key, value);
                return;
            }
            // Opción 2: localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(key, value);
            }
        } catch (error) {
            console.warn(`storage.setItem("${key}") failed, trying localStorage:`, error);
            try {
                window?.localStorage?.setItem(key, value);
            } catch {
                // Silently fail if nothing works
            }
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            // Opción 1: AsyncStorage nativo
            if (AsyncStorage !== null) {
                await AsyncStorage.removeItem(key);
                return;
            }
            // Opción 2: localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`storage.removeItem("${key}") failed, trying localStorage:`, error);
            try {
                window?.localStorage?.removeItem(key);
            } catch {
                // Silently fail
            }
        }
    }
};

export default storage;
