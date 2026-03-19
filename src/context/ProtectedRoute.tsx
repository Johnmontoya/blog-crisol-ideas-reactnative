// components/protected/ProtectedRoute.tsx para React Native
import { useNavigation } from "@react-navigation/native";
import React, { useContext, type JSX } from "react";
import routerMeta from "../types/routerMeta";
import { UserContext } from "./UserContextProvider";

interface IProtectedRoute {
    children: JSX.Element;
    path: string;
}

const ProtectedRoute = ({ children, path }: IProtectedRoute) => {
    const { isLogin, role, hasValidToken, isLoading } = useContext(UserContext);
    const navigation = useNavigation<any>();

    // -------------------------
    // 1. Buscar la ruta en routerMeta
    // -------------------------
    const currentRoute = Object.values(routerMeta).find(
        (route) => route.path === path
    );

    // -------------------------
    // 2. Determinar si es ruta pública
    // -------------------------
    const isPublicRoute =
        currentRoute?.isAuth === false || currentRoute?.isCommon === true;

    React.useEffect(() => {
        if (isLoading) return; // Esperar a que cargue la autenticación
        const handleNavigation = async () => {
            const state = navigation.getState();
            const currentRouteName = state?.routes[state?.index]?.name;
            let targetName: string | null = null;

            // 1. Redirigir si ya está logueado pero entra a Login/Register
            const isGuestOnlyRoute = currentRoute?.isAuth === false;
            
            if (isLogin && isGuestOnlyRoute) {
                targetName = role === "Admin" 
                    ? routerMeta.DashboardAdminPage.name 
                    : routerMeta.DashboardUsersPage.name;
            }
            // 2. Proteger si no está logueado (y no es común)
            else if (!isLogin && currentRoute?.isCommon !== true && !isGuestOnlyRoute) {
                targetName = routerMeta.LoginPage.name;
            }
            // 3. Rutas administrativas
            else if (isLogin && role !== "Admin" && (path === routerMeta.DashboardAdminPage.path || path.startsWith("/admin"))) {
                targetName = routerMeta.DashboardUsersPage.name;
            }
            // 4. Rutas del usuario normal
            else if (isLogin && role !== "User" && (path === routerMeta.DashboardUsersPage.path || path.startsWith("/user"))) {
                targetName = routerMeta.DashboardAdminPage.name;
            }

            // SOLO NAVEGAR SI EL DESTINO ES DISTINTO AL ACTUAL
            if (targetName && currentRouteName !== targetName) {
                // IMPORTANT: Defer navigation outside the render cycle to prevent Node removal errors on Web
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: targetName }],
                    });
                }, 0);
            }
        };

        handleNavigation();
    }, [isLogin, role, path, navigation, currentRoute]);

    // Si se está cargando la autenticación, no mostramos nada
    if (isLoading) return null;

    // Si es pública o las condiciones permiten mostrar el contenido
    if (isPublicRoute || (isLogin && hasValidToken)) {
        return children;
    }

    // Mientras redirigimos, no mostrar nada
    return null;
};

export default ProtectedRoute;