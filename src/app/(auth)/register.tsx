import { useRegisterUserMutation } from '@/queries/mutation/userMutation';
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
import { ArrowLeft, Lock, Mail, User } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
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

export default function RegisterScreen() {
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

    const [playfairLoaded] = usePlayfairFonts({
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
                                className="w-12 h-12 bg-gray-100 dark:bg-[#1e1e1e] rounded-full items-center justify-center mb-10 shadow-sm"
                            >
                                <ArrowLeft size={22} color={isDark ? '#f3f4f6' : '#1a1a1a'} strokeWidth={1.5} />
                            </Pressable>
                        </Animated.View>

                        {/* Brand Section */}
                        <Animated.View 
                            entering={FadeInUp.duration(800).delay(200)}
                            className="mb-10"
                        >
                            <Text
                                style={{ fontFamily: 'PlayfairDisplay_800ExtraBold' }}
                                className="text-4xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tight"
                            >
                                ÚNETE A NOSOTROS
                            </Text>
                            <View className="w-12 h-1 bg-[#d97706] mt-4 rounded-full" />
                            <Text
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="text-lg text-[#666] dark:text-[#999] mt-6"
                            >
                                Comienza tu viaje intelectual hoy.
                            </Text>
                        </Animated.View>

                        {/* Form Section */}
                        <Animated.View 
                            entering={FadeInDown.duration(800).delay(400)}
                            className="gap-5"
                        >
                            <View>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-2 ml-1">NOMBRE COMPLETO</Text>
                                <View className="relative">
                                    <View className="absolute left-5 top-[18px] z-10">
                                        <User size={18} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        style={{ fontFamily: 'Inter_400Regular' }}
                                        className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base"
                                        placeholder="Tu nombre"
                                        placeholderTextColor="#94a3b8"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-2 ml-1">CORREO ELECTRÓNICO</Text>
                                <View className="relative">
                                    <View className="absolute left-5 top-[18px] z-10">
                                        <Mail size={18} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        style={{ fontFamily: 'Inter_400Regular' }}
                                        className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base"
                                        placeholder="tu@email.com"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-2 ml-1">CONTRASEÑA</Text>
                                <View className="relative">
                                    <View className="absolute left-5 top-[18px] z-10">
                                        <Lock size={18} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        style={{ fontFamily: 'Inter_400Regular' }}
                                        className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base"
                                        placeholder="Mínimo 6 caracteres"
                                        placeholderTextColor="#94a3b8"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-2 ml-1">CONFIRMAR CONTRASEÑA</Text>
                                <View className="relative">
                                    <View className="absolute left-5 top-[18px] z-10">
                                        <Lock size={18} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        style={{ fontFamily: 'Inter_400Regular' }}
                                        className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base"
                                        placeholder="Repite tu contraseña"
                                        placeholderTextColor="#94a3b8"
                                        secureTextEntry
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>
                            </View>

                            {error && (
                                <View className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mt-2">
                                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-red-500 text-xs text-center">{error}</Text>
                                </View>
                            )}

                            <Pressable
                                onPress={handleRegister}
                                disabled={isSubmitting}
                                className={`bg-black dark:bg-white rounded-2xl py-5 items-center mt-6 shadow-xl ${
                                    isSubmitting ? 'opacity-70' : 'opacity-100'
                                }`}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={isDark ? '#000' : '#fff'} />
                                ) : (
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-lg tracking-wider">
                                        Crear Cuenta
                                    </Text>
                                )}
                            </Pressable>
                        </Animated.View>

                        {/* Footer */}
                        <Animated.View 
                            entering={FadeInUp.duration(800).delay(600)}
                            className="flex-row justify-center mt-10 mb-8"
                        >
                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-[#64748b]">
                                ¿Ya tienes cuenta?{' '}
                            </Text>
                            <Pressable onPress={() => router.back()}>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-sm text-[#d97706]">
                                    Inicia sesión.
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}


