import { ACCESS_TOKEN_KEY } from '@/config/config';
import { UserContext } from '@/context/UserContextProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { decodeToken } from '@/lib/jwt';
import token from '@/lib/token';
import { useLoginMutation } from '@/queries/mutation/userMutation';
import { useAuthStore } from '@/store/auth';
import routerMeta from '@/types/routerMeta';
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
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
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

export default function LoginScreen() {
    const { setIsLogin, setRole, setAuthToken } = useContext(UserContext);
    const navigation = useNavigation<any>();
    const auth = useAuthStore((state) => state.setUserData);
    const loginUserMutation = useLoginMutation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';

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
                                onPress={() => navigation.navigate(routerMeta.HomePage.name)}
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
                                CRISOL DE IDEAS
                            </Text>
                            <View className="w-12 h-1 bg-[#d97706] mt-4 rounded-full" />
                            <Text
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="text-lg text-[#666] dark:text-[#999] mt-6 leading-7"
                            >
                                Bienvenido de vuelta.{"\n"}
                                Tu santuario para la reflexión.
                            </Text>
                        </Animated.View>

                        {/* Form Section */}
                        <Animated.View
                            entering={FadeInDown.duration(800).delay(400)}
                            className="gap-6"
                        >
                            <View>
                                <Text
                                    style={{ fontFamily: 'Inter_700Bold' }}
                                    className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-3 ml-1"
                                >
                                    CORREO ELECTRÓNICO
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-5 top-[18px] z-10">
                                        <Mail size={18} color="#94a3b8" strokeWidth={1.5} />
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

                            <View>
                                <Text
                                    style={{ fontFamily: 'Inter_700Bold' }}
                                    className="text-[10px] tracking-widest uppercase text-[#94a3b8] mb-3 ml-1"
                                >
                                    CONTRASEÑA
                                </Text>
                                <View className="relative">
                                    <View className="absolute left-5 top-[18px] z-10">
                                        <Lock size={18} color="#94a3b8" strokeWidth={1.5} />
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
                                <Pressable
                                    onPress={() => navigation.navigate(routerMeta.ForgotPage.name)}
                                    className="mt-4 self-end"
                                >
                                    <Text
                                        style={{ fontFamily: 'Inter_600SemiBold' }}
                                        className="text-xs text-[#d97706]"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Text>
                                </Pressable>
                            </View>

                            {error && (
                                <View className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
                                    <Text
                                        style={{ fontFamily: 'Inter_400Regular' }}
                                        className="text-red-500 text-xs text-center leading-5"
                                    >
                                        {error}
                                    </Text>
                                </View>
                            )}

                            <Pressable
                                onPress={handleLogin}
                                disabled={isSubmitting}
                                className={`bg-black dark:bg-white rounded-2xl py-5 items-center mt-6 shadow-xl ${isSubmitting ? 'opacity-70' : 'opacity-100'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={isDark ? '#000' : '#fff'} />
                                ) : (
                                    <Text
                                        style={{ fontFamily: 'Inter_700Bold' }}
                                        className="text-white dark:text-black text-lg tracking-wider"
                                    >
                                        Iniciar Sesión
                                    </Text>
                                )}
                            </Pressable>
                        </Animated.View>

                        {/* Register Link */}
                        <Animated.View
                            entering={FadeInUp.duration(800).delay(600)}
                            className="flex-row justify-center mt-12 mb-8"
                        >
                            <Text
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="text-sm text-[#64748b]"
                            >
                                ¿No tienes cuenta?{' '}
                            </Text>
                            <Pressable onPress={() => navigation.navigate(routerMeta.RegisterPage.name)}>
                                <Text
                                    style={{ fontFamily: 'Inter_700Bold' }}
                                    className="text-sm text-[#d97706]"
                                >
                                    Regístrate ahora.
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
