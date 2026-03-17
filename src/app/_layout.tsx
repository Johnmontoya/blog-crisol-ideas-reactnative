import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import React, { Suspense } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/fallbacks/ErrorFallback";
import LoadingFallback from "../components/fallbacks/LoadingFall";
import ProtectedRoute from "../context/ProtectedRoute";
import UserContextProvider from "../context/UserContextProvider";
import routerMeta from "../types/routerMeta";

// Importaciones manuales
import "../assets/global.css";
import ForgotPage from "./(auth)/forgot-password";
import LoginPage from "./(auth)/login";
import RegisterPage from "./(auth)/register";
import ResetPassPage from "./(auth)/reset-password";
import UserVerifyPage from "./(auth)/veirfy";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

// Mapeo de componentes por ruta
const pageComponents = {
  [routerMeta.LoginPage.name]: LoginPage,
  [routerMeta.RegisterPage.name]: RegisterPage,
  [routerMeta.ForgotPage.name]: ForgotPage,
  [routerMeta.UserVerifyPage.name]: UserVerifyPage,
  [routerMeta.ResetPassPage.name]: ResetPassPage,
  [routerMeta.HomePage.name]: HomePage,
  [routerMeta.DashboardAdminPage.name]: AdminDashboard,
  [routerMeta.DashboardUsersPage.name]: UserDashboard,
};

function App() {
  const { reset } = useQueryErrorResetBoundary();

  const renderWithProtectedRoute = (Component: React.ComponentType, routeName: string, routePath: string) => {
    return (
      <ProtectedRoute path={routePath}>
        <Suspense fallback={<LoadingFallback />}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <ErrorFallback resetErrorBoundary={resetErrorBoundary} />
            )}
          >
            <Component />
          </ErrorBoundary>
        </Suspense>
      </ProtectedRoute>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        {/* Eliminamos NavigationContainer porque Expo Router ya provee uno en la raíz */}
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Landing/Home Page (Página Inicial) */}
          <Stack.Screen
            name={routerMeta.HomePage.name}
            options={{ headerShown: false }}
          >
            {(props) => renderWithProtectedRoute(
              HomePage,
              routerMeta.HomePage.name,
              routerMeta.HomePage.path
            )}
          </Stack.Screen>

          {/* Auth Routes */}
          <Stack.Screen
            name={routerMeta.LoginPage.name}
            options={{ headerShown: false }}
          >
            {(props) => renderWithProtectedRoute(
              LoginPage,
              routerMeta.LoginPage.name,
              routerMeta.LoginPage.path
            )}
          </Stack.Screen>

          {/* Mapea todas tus rutas dinámicamente */}
          {Object.values(routerMeta).map((route) => {
            if (
              route.name === routerMeta.LoginPage.name ||
              route.name === routerMeta.HomePage.name
            ) return null;

            const Component = pageComponents[route.name];
            if (!Component) return null;

            return (
              <Stack.Screen
                key={route.name}
                name={route.name}
                options={{
                  headerShown: route.isCommon ? true : false,
                  title: route.name,
                }}
              >
                {(props) => renderWithProtectedRoute(
                  Component,
                  route.name,
                  route.path
                )}
              </Stack.Screen>
            );
          })}
        </Stack.Navigator>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;