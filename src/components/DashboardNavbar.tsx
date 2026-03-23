import { ACCESS_TOKEN_KEY } from '@/config/config';
import { UserContext } from '@/context/UserContextProvider';
import { useGetUserIdQueries } from '@/queries/query/user.query';
import { useAuthStore } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    <Text style={styles.brandTitle}>{title || 'Dashboard'}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{role || 'User'}</Text>
                    </View>
                </View>

                <AnimatedPressable
                    style={styles.profileButton}
                    onPress={() => setMenuVisible(true)}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-down" size={16} color="#64748b" />
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
                    style={styles.modalOverlay}
                    onPress={() => setMenuVisible(false)}
                >
                    <Animated.View 
                        entering={SlideInRight.springify().damping(15).stiffness(150)}
                        style={styles.menuContainer}
                    >
                        <View style={styles.menuHeader}>
                            <Text style={styles.userName}>Mi Cuenta</Text>
                            <Text style={styles.userRole}>{user?.username}</Text>
                        </View>

                        <View style={styles.divider} />

                        {/* Opciones según el ROL */}
                        {role === 'Admin' && (
                            <>
                                <AnimatedPressable style={styles.menuItem} onPress={() => {
                                    setMenuVisible(false);
                                    setTimeout(() => {
                                        navigation.navigate(routerMeta.UserList.name);
                                    }, 100);
                                }}>
                                    <Ionicons name="people-outline" size={20} color="#1e293b" />
                                    <Text style={styles.menuItemText}>Usuarios</Text>
                                </AnimatedPressable>

                                <AnimatedPressable style={styles.menuItem} onPress={() => {
                                    setMenuVisible(false);
                                    setTimeout(() => {
                                        navigation.navigate(routerMeta.AddBlog.name);
                                    }, 100);
                                }}>
                                    <Ionicons name="add-circle-outline" size={20} color="#1e293b" />
                                    <Text style={styles.menuItemText}>Agregar Blog</Text>
                                </AnimatedPressable>
                            </>
                        )}

                        <AnimatedPressable style={styles.menuItem} onPress={() => {
                            setMenuVisible(false);
                            setTimeout(() => {
                                navigation.navigate(routerMeta.ProfilePage.name);
                            }, 100);
                        }}>
                            <Ionicons name="person-outline" size={20} color="#1e293b" />
                            <Text style={styles.menuItemText}>Perfil</Text>
                        </AnimatedPressable>

                        <AnimatedPressable style={styles.menuItem} onPress={() => {
                            setMenuVisible(false);
                            setTimeout(() => {
                                navigation.navigate(routerMeta.HomePage.name);
                            }, 100);
                        }}>
                            <Ionicons name="home-outline" size={20} color="#1e293b" />
                            <Text style={styles.menuItemText}>Ir al Inicio</Text>
                        </AnimatedPressable>

                        <View style={styles.divider} />

                        <AnimatedPressable style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
                        </AnimatedPressable>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    brandTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
    },
    roleBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0369a1',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 4,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#6366f1',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    avatarText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuContainer: {
        marginTop: Platform.OS === 'ios' ? 50 : 20,
        marginRight: 20,
        width: 220,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    menuHeader: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    userName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    userRole: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
    },
    logoutItem: {
        marginTop: 2,
    },
    logoutText: {
        color: '#ef4444',
    }
});
