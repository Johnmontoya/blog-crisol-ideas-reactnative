import { UserContext } from '@/context/UserContextProvider';
import { useAuthStore } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import routerMeta from '../types/routerMeta';
import token from '../lib/token';
import { ACCESS_TOKEN_KEY } from '@/config/config';

interface NavbarProps {
    title?: string;
}

export default function DashboardNavbar({ title }: NavbarProps) {
    const { role, setIsLogin, setRole, setAuthToken } = useContext(UserContext);
    const logoutStore = useAuthStore(state => state.logout);
    const navigation = useNavigation<any>();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleLogout = async () => {
        try {
            setMenuVisible(false);
            
            // 1. Limpiar almacenamiento persistente
            await token.removeToken(ACCESS_TOKEN_KEY);
            
            // 2. Limpiar estado de Zustand
            logoutStore();
            
            // 3. Limpiar contexto (esto activará automáticamente el ProtectedRoute para redirigir)
            setAuthToken(null);
            setRole(null);
            setIsLogin(false);
            
            // No necesitamos navigation.reset aquí porque ProtectedRoute ya lo hace al detectar !isLogin
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

                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => setMenuVisible(true)}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {role === 'Admin' ? 'A' : 'U'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-down" size={16} color="#64748b" />
                </TouchableOpacity>
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
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.userName}>Mi Cuenta</Text>
                            <Text style={styles.userRole}>{role === 'Admin' ? 'Administrador' : 'Usuario'}</Text>
                        </View>
                        
                        <View style={styles.divider} />

                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate(routerMeta.ProfilePage.name);
                        }}>
                            <Ionicons name="person-outline" size={20} color="#1e293b" />
                            <Text style={styles.menuItemText}>Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate(routerMeta.HomePage.name);
                        }}>
                            <Ionicons name="home-outline" size={20} color="#1e293b" />
                            <Text style={styles.menuItemText}>Ir al Inicio</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            <Text style={[styles.menuItemText, styles.logoutText]}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    roleBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0369a1',
        textTransform: 'uppercase',
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 4,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuContainer: {
        marginTop: 110,
        marginRight: 20,
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    menuHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    userRole: {
        fontSize: 12,
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
        paddingVertical: 12,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e293b',
    },
    logoutItem: {
        marginTop: 4,
    },
    logoutText: {
        color: '#ef4444',
    }
});
