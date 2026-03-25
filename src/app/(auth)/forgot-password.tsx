import { useForgotMutation } from '@/queries/mutation/userMutation';
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
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';
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
                                className="w-12 h-12 bg-gray-100 dark:bg-[#1e1e1e] rounded-full items-center justify-center mb-12 shadow-sm"
                            >
                                <ArrowLeft size={22} color={isDark ? '#f3f4f6' : '#1a1a1a'} strokeWidth={1.5} />
                            </Pressable>
                        </Animated.View>

                        {/* Title Section */}
                        <Animated.View 
                            entering={FadeInUp.duration(800).delay(200)}
                            className="mb-12"
                        >
                            <Text
                                style={{ fontFamily: 'PlayfairDisplay_800ExtraBold' }}
                                className="text-4xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tight"
                            >
                                {isSuccess ? 'REVISA TU CORREO' : 'RECUPERAR ACCESO'}
                            </Text>
                            <View className="w-12 h-1 bg-[#d97706] mt-4 rounded-full" />
                            <Text
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="text-lg text-[#666] dark:text-[#999] mt-6 leading-7"
                            >
                                {isSuccess 
                                    ? `Hemos enviado las instrucciones a ${email}.`
                                    : "Ingresa tu email y te ayudaremos a volver a tu cuenta."}
                            </Text>
                        </Animated.View>

                        {!isSuccess ? (
                            <Animated.View 
                                entering={FadeInDown.duration(800).delay(400)}
                                className="gap-8"
                            >
                                <View>
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-3 ml-1">CORREO ELECTRÓNICO</Text>
                                    <View className="relative">
                                        <View className="absolute left-5 top-[18px] z-10">
                                            <Mail size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            style={{ fontFamily: 'Inter_400Regular' }}
                                            className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl pl-14 pr-6 py-5 text-[#1a1a1a] dark:text-[#f3f4f6] text-base shadow-sm"
                                            placeholder="tu@email.com"
                                            placeholderTextColor="#94a3b8"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                </View>

                                {error && (
                                    <View className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
                                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-red-500 text-xs text-center">{error}</Text>
                                    </View>
                                )}

                                <Pressable
                                    onPress={handleForgot}
                                    disabled={isSubmitting}
                                    className={`bg-black dark:bg-white rounded-2xl py-5 items-center mt-4 shadow-xl ${
                                        isSubmitting ? 'opacity-70' : 'opacity-100'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color={isDark ? '#000' : '#fff'} />
                                    ) : (
                                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-lg tracking-wider">
                                            Enviar Instrucciones
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
                                
                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-center text-[#666] dark:text-[#999] leading-6 px-6">
                                    No olvides revisar tu carpeta de spam si no ves el mensaje en unos minutos.
                                </Text>

                                <Pressable
                                    onPress={() => router.back()}
                                    className="bg-gray-100 dark:bg-[#1e1e1e] rounded-2xl py-5 px-10 items-center w-full"
                                >
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#1a1a1a] dark:text-[#f3f4f6]">
                                        Volver al Login
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
