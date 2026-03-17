import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import storage from "../lib/storage";

type State = {
    userId: string;
    token: string;
}

type Actions = {
    setUserData: (userId: string, token: string) => void;
    logout: () => void;
}

// Adaptador para que Zustand use nuestro storage personalizado
const zustandStorage = createJSONStorage<State & Actions>(() => ({
    getItem: async (key: string) => {
        const val = await storage.getItem(key);
        return val ?? null;
    },
    setItem: async (key: string, value: string) => {
        await storage.setItem(key, value);
    },
    removeItem: async (key: string) => {
        await storage.removeItem(key);
    },
}));

export const useAuthStore = create<State & Actions>()(
    persist(
        (set) => ({
            userId: '',
            token: '',
            setUserData(userId: string, token: string) {
                set(() => ({
                    userId,
                    token
                }))
            },
            logout() {
                set(() => ({
                    userId: '',
                    token: '',
                }))
            },
        }),
        {
            name: 'auth',
            storage: zustandStorage,
        }
    )
)