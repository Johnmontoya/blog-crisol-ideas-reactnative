import { useResetMutation } from '@/queries/mutation/userMutation';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ResetPasswordPage() {
  const { userId, token } = useLocalSearchParams<{ userId: string; token: string }>();
  const resetMutation = useResetMutation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!userId || !token) {
      setError('Enlace de restablecimiento inválido o expirado.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await resetMutation.mutateAsync({
        userId,
        token,
        password: password.trim(),
      }, {
        onSuccess: () => {
          setIsSuccess(true);
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña.');
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
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/50 justify-center items-center mb-4">
              <Text className="text-3xl text-violet-400">✦</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-100 tracking-tight text-center">
              Nueva Contraseña
            </Text>
            {!isSuccess && (
              <Text className="text-sm text-gray-400 mt-2 text-center px-2">
                Crea una contraseña segura para proteger tu cuenta.
              </Text>
            )}
          </View>

          {!isSuccess ? (
            <View className="space-y-4">
              <View>
                <Text className="text-xs font-semibold text-gray-300 mb-2 ml-1">Nueva Contraseña</Text>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-gray-50 text-[15px]"
                  placeholder="••••••••"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError(null);
                  }}
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-gray-300 mb-2 mt-4 ml-1">Confirmar Contraseña</Text>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-gray-50 text-[15px]"
                  placeholder="••••••••"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (error) setError(null);
                  }}
                />
              </View>

              {error && (
                <View className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-4">
                  <Text className="text-red-300 text-xs text-center">{error}</Text>
                </View>
              )}

              <Pressable
                onPress={handleReset}
                disabled={isSubmitting}
                className={`bg-violet-600 rounded-2xl py-4 items-center mt-8 active:opacity-80 active:scale-[0.98] ${
                  isSubmitting ? 'opacity-70' : 'opacity-100'
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base tracking-wide">Cambiar contraseña</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View className="items-center py-4">
              <View className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/50 justify-center items-center mb-4">
                <Text className="text-2xl text-green-400">✓</Text>
              </View>
              <Text className="text-gray-100 text-center font-medium mb-2">¡Completado!</Text>
              <Text className="text-gray-400 text-center text-sm px-4">
                Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
              </Text>
              
              <Pressable
                onPress={() => router.replace('/(auth)/login')}
                className="bg-violet-600 rounded-2xl py-4 px-10 items-center mt-8"
              >
                <Text className="text-white font-bold">Ir a Iniciar Sesión</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}