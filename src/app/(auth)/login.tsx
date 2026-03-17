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

          auth(userId, data.data.token);
          setRole(role);
          setAuthToken(data.data.token);
          setIsLogin(true);

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
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white/10 rounded-[32px] border border-white/10 py-10 px-8 backdrop-blur-md">
          {/* Brand */}
          <View className="items-center mb-9">
            <View className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/50 justify-center items-center mb-4">
              <Text className="text-3xl text-violet-400">✦</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-100 tracking-tight">Crisol Ideas</Text>
            <Text className="text-sm text-gray-400 mt-1">Bienvenido de vuelta</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-xs font-semibold text-gray-300 mb-2 ml-1">Correo electrónico</Text>
              <TextInput
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-gray-50 text-[15px]"
                placeholder="tu@email.com"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-gray-300 mb-2 mt-4 ml-1">Contraseña</Text>
              <TextInput
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-gray-50 text-[15px]"
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {error && (
              <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-4">
                <Text className="text-red-300 text-xs text-center">{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleLogin}
              disabled={isSubmitting}
              className={`bg-violet-600 rounded-2xl py-4 items-center mt-8 active:opacity-80 active:scale-[0.98] ${
                isSubmitting ? 'opacity-70' : 'opacity-100'
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base tracking-wide">Iniciar sesión</Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-sm text-gray-400">¿No tienes cuenta? </Text>
            <Pressable onPress={() => navigation.navigate(routerMeta.RegisterPage.name)}>
              <Text className="text-sm text-violet-400 font-bold">Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
