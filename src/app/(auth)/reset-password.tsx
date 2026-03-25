import { useResetMutation } from '@/queries/mutation/userMutation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts as useInterFonts
} from '@expo-google-fonts/inter';
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    useFonts as usePlayfairFonts
} from '@expo-google-fonts/playfair-display';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

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
  };    const [playfairLoaded] = usePlayfairFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
        PlayfairDisplay_800ExtraBold,
    });

    const [interLoaded] = useInterFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';

    if (!playfairLoaded || !interLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#d97706" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="flex-1 px-8 pt-20 pb-12">
                        {/* Back Button */}
                        <Animated.View entering={FadeInUp.duration(600)}>
                            <Pressable
                                onPress={() => router.back()}
                                className="w-12 h-12 bg-gray-100 dark:bg-[#1e1e1e] rounded-full items-center justify-center mb-12 shadow-sm"
                            >
                                <ArrowLeft size={22} color={isDark ? '#f3f4f6' : '#1a1a1a'} strokeWidth={1.5} />
                            </Pressable>
                        </Animated.View>

                        {/* Brand Section */}
                        <Animated.View 
                            entering={FadeInUp.duration(800).delay(200)}
                            className="mb-12"
                        >
                            <Text
                                style={{ fontFamily: 'PlayfairDisplay_800ExtraBold' }}
                                className="text-4xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tight"
                            >
                                {isSuccess ? '¡TODO LISTO!' : 'NUEVA CONTRASEÑA'}
                            </Text>
                            <View className="w-12 h-1 bg-[#d97706] mt-4 rounded-full" />
                            <Text
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="text-lg text-[#666] dark:text-[#999] mt-6 leading-7"
                            >
                                {isSuccess 
                                    ? "Tu seguridad ha sido actualizada con éxito."
                                    : "Crea una credencial robusta para proteger tu santuario de ideas."}
                            </Text>
                        </Animated.View>

                        {!isSuccess ? (
                            <Animated.View 
                                entering={FadeInDown.duration(800).delay(400)}
                                className="gap-6"
                            >
                                <View>
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-3 ml-1">NUEVA CONTRASEÑA</Text>
                                    <View className="relative">
                                        <View className="absolute left-5 top-[18px] z-10">
                                            <Lock size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            style={{ fontFamily: 'Inter_400Regular' }}
                                            className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base shadow-sm"
                                            placeholder="••••••••"
                                            placeholderTextColor="#94a3b8"
                                            secureTextEntry
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-3 ml-1">CONFIRMAR CONTRASEÑA</Text>
                                    <View className="relative">
                                        <View className="absolute left-5 top-[18px] z-10">
                                            <Lock size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            style={{ fontFamily: 'Inter_400Regular' }}
                                            className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base shadow-sm"
                                            placeholder="••••••••"
                                            placeholderTextColor="#94a3b8"
                                            secureTextEntry
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                        />
                                    </View>
                                </View>

                                {error && (
                                    <View className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
                                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-red-500 text-xs text-center">{error}</Text>
                                    </View>
                                )}

                                <Pressable
                                    onPress={handleReset}
                                    disabled={isSubmitting}
                                    className={`bg-black dark:bg-white rounded-2xl py-5 items-center mt-6 shadow-xl ${
                                        isSubmitting ? 'opacity-70' : 'opacity-100'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color={isDark ? '#000' : '#fff'} />
                                    ) : (
                                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-lg tracking-wider">
                                            Restablecer Contraseña
                                        </Text>
                                    )}
                                </Pressable>
                            </Animated.View>
                        ) : (
                            <Animated.View 
                                entering={FadeInDown.duration(800)}
                                className="items-center py-10 gap-8"
                            >
                                <View className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/10 items-center justify-center">
                                    <CheckCircle2 size={40} color="#10b981" strokeWidth={1.5} />
                                </View>
                                
                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-center text-[#666] dark:text-[#999] leading-6 px-4">
                                    Tu contraseña ha sido actualizada. Ahora puedes volver a entrar a tu santuario de reflexión.
                                </Text>

                                <Pressable
                                    onPress={() => router.replace('/(auth)/login')}
                                    className="bg-black dark:bg-white rounded-2xl py-5 px-10 items-center w-full shadow-xl"
                                >
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black">
                                        Ir al Inicio de Sesión
                                    </Text>
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}