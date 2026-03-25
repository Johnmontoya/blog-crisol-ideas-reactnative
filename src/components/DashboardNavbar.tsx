import { ACCESS_TOKEN_KEY } from '@/config/config';
import { UserContext } from '@/context/UserContextProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetUserIdQueries } from '@/queries/query/user.query';
import { useAuthStore } from '@/store/auth';
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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    Text,
    View
} from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import token from '../lib/token';
import routerMeta from '../types/routerMeta';
import AnimatedPressable from './ui/AnimatedPressable';

interface NavbarProps {
    title?: string;
}

export default function DashboardNavbar({ title }: NavbarProps) {
    const { role, setIsLogin, setRole, setAuthToken } = useContext(UserContext);
    const logoutStore = useAuthStore(state => state.logout);
    const { userId } = useAuthStore();
    const data = useGetUserIdQueries(userId)
    const user = data[0].data?.user;
    const navigation = useNavigation<any>();
    const [menuVisible, setMenuVisible] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';

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
        return null;
    }

    const handleLogout = async () => {
        try {
            setMenuVisible(false);

            // 1. Limpiar almacenamiento persistente
            await token.removeToken(ACCESS_TOKEN_KEY);

            // 2. Limpiar estado de Zustand
            logoutStore();

            // 3. Limpiar contexto
            setAuthToken(null);
            setRole(null);
            setIsLogin(false);

        } catch (error) {
            console.error("Error durante el logout:", error);
        }
    };

    return (
        <SafeAreaView
            className="bg-[#fdfdfc] dark:bg-[#121212] border-b border-black/[0.05] dark:border-white/[0.05] z-[100]"
        >
            <View className="h-[60px] flex-row items-center justify-between px-5">
                <View className="flex-row items-start gap-2">
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_800ExtraBold' }}
                        className="text-xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tighter"
                    >
                        {title || 'Dashboard'}
                    </Text>
                    <View className="bg-[#fef3c7] dark:bg-amber-900/30 px-2 py-1 rounded-md">
                        <Text
                            style={{ fontFamily: 'Inter_700Bold' }}
                            className="text-[9px] text-[#d97706] dark:text-amber-400 uppercase tracking-widest"
                        >
                            {role || 'User'}
                        </Text>
                    </View>
                </View>

                <AnimatedPressable
                    className="flex-row items-center gap-2 p-1"
                    onPress={() => setMenuVisible(true)}
                >
                    <View className="w-9 h-9 rounded-xl bg-[#1a1a1a] dark:bg-white items-center justify-center shadow-sm">
                        <Text
                            style={{ fontFamily: 'Inter_700Bold' }}
                            className="text-white dark:text-black text-base"
                        >
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-down" size={14} color={isDark ? '#999' : '#64748b'} />
                </AnimatedPressable>
            </View>

            {/* Modal para el Menú Desplegable */}
            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-[#0f172a]/40 justify-start items-end"
                    onPress={() => setMenuVisible(false)}
                >
                    <Animated.View
                        entering={SlideInRight.springify().damping(15).stiffness(150)}
                        className={`mt-[${Platform.OS === 'ios' ? '50px' : '20px'}] mr-5 w-56 bg-white dark:bg-[#1e1e1e] rounded-2xl py-2 shadow-2xl`}
                        style={Platform.select({
                            ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.15,
                                shadowRadius: 24,
                            },
                        })}
                    >
                        <View className="px-4 py-3.5">
                            <Text className="text-base font-extrabold text-[#0f172a] dark:text-[#f3f4f6]" style={{ fontFamily: 'Inter_700Bold' }}>
                                Mi Cuenta
                            </Text>
                            <Text className="text-xs font-medium text-[#64748b] dark:text-gray-400 mt-0.5" style={{ fontFamily: 'Inter_400Regular' }}>
                                {user?.username}
                            </Text>
                        </View>

                        <View className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1" />

                        <AnimatedPressable
                            className="flex-row items-center gap-3 px-4 py-3.5"
                            onPress={() => {
                                setMenuVisible(false);
                                setTimeout(() => {
                                    navigation.navigate(routerMeta.HomePage.name);
                                }, 100);
                            }}
                        >
                            <Ionicons name="home-outline" size={18} color={isDark ? '#f3f4f6' : '#1e293b'} />
                            <Text className="text-[15px] font-semibold text-[#334155] dark:text-gray-300" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                Ir al Inicio
                            </Text>
                        </AnimatedPressable>

                        <View className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1" />

                        <AnimatedPressable
                            className="flex-row items-center gap-3 px-4 py-3.5 mt-0.5"
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                            <Text className="text-[15px] font-semibold text-red-500" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                Cerrar Sesión
                            </Text>
                        </AnimatedPressable>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

