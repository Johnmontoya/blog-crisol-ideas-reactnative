import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY } from "../config/config";
import { decodeToken } from "../lib/jwt";
import token from "../lib/token";

const useIsLoginContext = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        const initAuth = async () => {
            try {
                const t = await token.getToken(ACCESS_TOKEN_KEY);
                if (t) {
                    setAuthToken(t);
                    setIsLogin(true);
                    const decoded = decodeToken(t);
                    setRole(decoded?.role ?? null);
                }
            } catch (error) {
                console.error("Auth init error:", error);
            } finally {
                setIsLoading(false);
            }
        };
                initAuth();
    }, []);

    const hasValidToken = isLogin;

    return {
        axios,
        router,
        isLogin,
        setIsLogin,
        authToken,
        setAuthToken, // Exponemos setAuthToken
        hasValidToken,
        role,
        setRole,
        input,
        setInput,
        darkMode,
        setDarkMode,
        isLoading,
    };
};

export default useIsLoginContext;