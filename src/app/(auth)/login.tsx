import { ACCESS_TOKEN_KEY } from '@/config/config';
import { UserContext } from '@/context/UserContextProvider';
import { decodeToken } from '@/lib/jwt';
import token from '@/lib/token';
import { useLoginMutation } from '@/queries/mutation/userMutation';
import { useAuthStore } from '@/store/auth';
import routerMeta from '@/types/routerMeta';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { setIsLogin, setRole, setAuthToken } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const auth = useAuthStore((state) => state.setUserData);
  const loginUserMutation = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await loginUserMutation.mutateAsync({ email: email.trim(), password }, {
        onSuccess: (data) => {
          token.setToken(ACCESS_TOKEN_KEY, data.data.token);
          const decoded = decodeToken(data.data.token);
          const { role, userId } = decoded;

          auth(userId, data.data.token); // Corrected: passing token instead of role
          setRole(role);
          setAuthToken(data.data.token); // Sincronizamos el token en el contexto
          setIsLogin(true);

          // La navegación ahora la maneja principalmente el ProtectedRoute al detectar isLogin=true,
          // pero forzamos el reset aquí para asegurar la dirección correcta según el rol.
          const targetDashboard = role === "Admin"
            ? routerMeta.DashboardAdminPage.name
            : routerMeta.DashboardUsersPage.name;

          navigation.reset({
            index: 0,
            routes: [{ name: targetDashboard }],
          });
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.card}>
          {/* Brand */}
          <View style={styles.brandWrapper}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>✦</Text>
            </View>
            <Text style={styles.appName}>Crisol Ideas</Text>
            <Text style={styles.tagline}>Bienvenido de vuelta</Text>
          </View>

          {/* Fields */}
          <View style={styles.form}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleLogin}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <Pressable onPress={() => navigation.navigate(routerMeta.RegisterPage.name)}>
              <Text style={styles.footerLink}>Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(147,112,219,0.25)',
    borderWidth: 1.5,
    borderColor: '#9370db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
    color: '#c084fc',
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f3f4f6',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f9fafb',
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  footerLink: {
    color: '#c084fc',
    fontSize: 14,
    fontWeight: '600',
  },
});
