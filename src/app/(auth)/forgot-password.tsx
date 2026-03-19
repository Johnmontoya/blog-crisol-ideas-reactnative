import { useForgotMutation } from '@/queries/mutation/userMutation';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordPage() {
    const forgotMutation = useForgotMutation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleForgot = async () => {
        if (!email.trim()) {
            setError('Por favor ingresa tu correo electrónico.');
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Por favor ingresa un correo válido.');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await forgotMutation.mutateAsync({ email: email.trim() }, {
                onSuccess: () => {
                    setIsSuccess(true);
                },
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al procesar la solicitud.');
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
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/50 justify-center items-center mb-4">
                            <Text className="text-3xl text-violet-400">✦</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-100 tracking-tight text-center">
                            Recuperar Contraseña
                        </Text>
                        {!isSuccess && (
                            <Text className="text-sm text-gray-400 mt-2 text-center">
                                Ingresa tu email para enviarte las instrucciones.
                            </Text>
                        )}
                    </View>

                    {!isSuccess ? (
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
                                    onChangeText={(text) => {
                                        setEmail(text);
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
                                onPress={handleForgot}
                                disabled={isSubmitting}
                                className={`bg-violet-600 rounded-2xl py-4 items-center mt-8 active:opacity-80 active:scale-[0.98] ${isSubmitting ? 'opacity-70' : 'opacity-100'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-base tracking-wide">Enviar instrucciones</Text>
                                )}
                            </Pressable>
                        </View>
                    ) : (
                        <View className="items-center py-4">
                            <View className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/50 justify-center items-center mb-4">
                                <Text className="text-2xl text-green-400">✓</Text>
                            </View>
                            <Text className="text-gray-100 text-center font-medium mb-2">¡Correo enviado!</Text>
                            <Text className="text-gray-400 text-center text-sm px-4">
                                Hemos enviado las instrucciones para restablecer tu contraseña a {email}.
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="bg-white/5 border border-white/10 rounded-2xl py-4 px-8 items-center mt-8"
                            >
                                <Text className="text-violet-400 font-bold">Volver al inicio</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Footer */}
                    {!isSuccess && (
                        <View className="flex-row justify-center mt-8">
                            <Pressable onPress={() => router.back()}>
                                <Text className="text-sm text-violet-400 font-bold">Volver atrás</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
