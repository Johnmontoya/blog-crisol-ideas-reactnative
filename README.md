# 📝 Blog "Crisol de Ideas" - App Móvil

Aplicación móvil desarrollada con **React Native** y **Expo** para la gestión y visualización dinámica de noticias y artículos del blog "Crisol de Ideas".

## ✨ Características Principales

### 📰 Renderizado Dinámico de HTML
La visualización de los artículos se gestiona a través de un componente avanzado utilizando `react-native-webview`. Esto permite renderizar código HTML rico (imágenes, negritas, cursivas, listas) directamente desde la base de datos, inyectando scripts (`injectedJavaScript`) para lograr una **auto-altura adaptativa** al contenido, garantizando una lectura fluida sin scrollbars excesivas.

### ✍️ Creación de Entradas (Nesting Navigation)
La pantalla de creación de noticias (`addnews.tsx`) utiliza una experiencia de usuario fluida mediante **Material Top Tab Navigators**. Los editores pueden seleccionar visualmente entre múltiples plantillas de diseño y los formularios cambian de manera dinámica:
- **Hero Image:** Campos para URL de imagen y contexto visual.
- **Quote Block:** Plantilla enfocada en resaltar frases célebres y fuentes.
- **Bullet List:** Sistema organizado para resumir puntos clave y nombrar editores.
*(Todos los formularios están modularizados en `src/app/(newsform)` para mantener un código limpio y escalable).*

### 🔗 Integración Share Nativa
Los usuarios pueden compartir fácilmente las entradas del blog utilizando la **API nativa Share** de React Native (`Share.share`), compartiendo dinámicamente el título y el enlace web hacia la publicación en cualquier aplicación de su dispositivo.

### 🛡️ Conexión Robusta con Backend y CORS
La aplicación está configurada para consumir una API REST alojada en Render (`https://backendcrisolideas.onrender.com`).
- **Axios Interceptors:** Manejo automático de tokens de autorización y tiempos de espera para entornos móviles de baja conexión.
- **Gestión de Entorno:** Configuración extraída a variables de entorno (`.env`) mediante `process.env.EXPO_PUBLIC_API_URL`.
- **Compatibilidad CORS Mode:** El backend fue optimizado en sus políticas CORS (`!origin`) para permitir las solicitudes legítimas del APK móvil, el cual por definición carece de cabecera Origin.

### 📦 Preparado para Distribución (Android APK)
El proyecto ha sido personalizado en `app.json` (Splash screen en color corporativo `#4C36F2`, nombre "Crisol de Ideas") y preparado para compilarse como un instalable de Android (`.apk`) utilizando el entorno de **EAS Build** local/nube.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React Native + Expo (Expo Router)
- **Navegación:** `expo-router` / `@react-navigation/material-top-tabs`
- **Estilos:** Tailwind CSS (vía NativeWind)
- **Íconos:** `lucide-react-native`
- **Animaciones:** `react-native-reanimated` / `expo-haptics` (Feedback háptico)
- **Webview:** `react-native-webview`
- **Peticiones HTTP:** `axios`

## 🚀 Empezando (Desarrollo)

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Renombrar o crear un archivo `.env` en la raíz con la URL de tu API:
   ```env
   EXPO_PUBLIC_API_URL=https://tuanilloenrender.com
   ```

3. Iniciar la aplicación en modo desarrollo:
   ```bash
   npx expo start
   ```

## 🏗️ Compilación de APK (EAS Build)

La app está lista para exportarse localmente o a la nube mediante Expo Application Services.
```bash
# Login
eas login 

# Configurar servidor de build
eas build:configure

# Crear build para Android (APK preview)
eas build -p android --profile preview
```
