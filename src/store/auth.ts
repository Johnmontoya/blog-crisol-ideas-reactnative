import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    userId: string;
    token: string;
}

type Actions = {
    setUserData: (userId: string, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create(
    persist<State & Actions>(
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
        }), {
        name: 'auth'
    }
    )
)