import { UserContext } from '@/context/UserContextProvider';
import { useRegisterUserMutation } from '@/queries/mutation/userMutation';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const { } = useContext(UserContext);
  const createUserMutation = useRegisterUserMutation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('El correo electrónico no es válido.');
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

    setError(null);
    setIsSubmitting(true);
    try {
      await createUserMutation.mutateAsync({ username: name.trim(), email: email.trim(), password }, {
        onSuccess: () => {
          router.replace('/(auth)/login');
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white/5 rounded-3xl border border-white/10 py-10 px-7 backdrop-blur-md">
            {/* Brand */}
            <View className="items-center mb-9">
              <View className="w-16 h-16 rounded-full bg-violet-500/25 border border-violet-500 justify-center items-center mb-4">
                <Text className="text-3xl text-violet-300">✦</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-50 tracking-wide">Crisol Ideas</Text>
              <Text className="text-sm text-gray-400 mt-1">Crea tu cuenta</Text>
            </View>

            {/* Fields */}
            <View className="gap-y-4">
              <View>
                <Text className="text-[13px] font-semibold text-gray-300 mb-1.5 ml-1">Nombre</Text>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-gray-50 text-[15px]"
                  placeholder="Tu nombre"
                  placeholderTextColor="#6b7280"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View>
                <Text className="text-[13px] font-semibold text-gray-300 mb-1.5 ml-1">Correo electrónico</Text>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-gray-50 text-[15px]"
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
                <Text className="text-[13px] font-semibold text-gray-300 mb-1.5 ml-1">Contraseña</Text>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-gray-50 text-[15px]"
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View>
                <Text className="text-[13px] font-semibold text-gray-300 mb-1.5 ml-1">Confirmar contraseña</Text>
                <TextInput
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-gray-50 text-[15px]"
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              {error && (
                <View className="bg-red-500/15 border border-red-500/40 rounded-lg p-3 mt-3.5">
                  <Text className="text-red-300 text-[13px] text-center">{error}</Text>
                </View>
              )}

              <Pressable
                className={`bg-violet-600 rounded-2xl py-4 items-center mt-6 active:opacity-85 active:scale-[0.98] ${
                  isSubmitting ? 'opacity-70' : 'opacity-100'
                }`}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base tracking-wide">Crear cuenta</Text>
                )}
              </Pressable>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-sm text-gray-400">¿Ya tienes cuenta? </Text>
              <Pressable onPress={() => router.back()}>
                <Text className="text-sm text-violet-400 font-bold">Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


