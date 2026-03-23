import { USERS_DATA } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeleteMutation, useVerifiedMutation } from '@/queries/mutation/userMutation';
import { useGetUsersQueries } from '@/queries/query/user.query';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    useFonts as useInterFonts
} from '@expo-google-fonts/inter';
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    useFonts as usePlayfairFonts
} from '@expo-google-fonts/playfair-display';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Shield, Trash2, UserCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function UsersScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const queryClient = useQueryClient();
    const [usersQuery] = useGetUsersQueries();
    const { data: usersData, isLoading, isError } = usersQuery;

    // Estado para el modal de confirmación
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: string, name: string } | null>(null);

    // Mutaciones
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteMutation();
    const { mutate: toggleStatus, isPending: isToggling } = useVerifiedMutation();

    const [playfairLoaded] = usePlayfairFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
    });

    const [interLoaded] = useInterFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
    });

    const users = usersData?.users || (Array.isArray(usersData) ? usersData : []);

    const openDeleteModal = (userId: string, username: string) => {
        setSelectedUser({ id: userId, name: username });
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (!selectedUser) return;

        deleteUser(selectedUser.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [USERS_DATA] });
                setModalVisible(false);
                setSelectedUser(null);
            },
        });
    };

    const handleToggleStatus = (userId: string, currentStatus: boolean) => {
        toggleStatus({ userId, verified: !currentStatus }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [USERS_DATA] });
            },
        });
    };

    if (!playfairLoaded || !interLoaded || isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#000" />
                {!isLoading && <Text className="mt-4 text-[#666]">Cargando fuentes...</Text>}
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212] p-10">
                <Shield size={48} color="#ef4444" />
                <Text className="mt-4 text-center text-[#ef4444] font-bold text-lg">Error al cargar datos</Text>
                <Text className="mt-2 text-center text-[#64748b]">No se pudo conectar con el servidor.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 60 }}
            >
                {/* Header Section */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(100)}
                    className="mb-8"
                >
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                        className="text-6xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tighter"
                    >
                        Todos los usuarios.
                    </Text>
                    <Text
                        style={{ fontFamily: 'Inter_400Regular' }}
                        className="text-lg text-[#666] dark:text-[#999] mt-2"
                    >
                        Listado de todos los usuarios registrados en el sistema.
                    </Text>
                    <View className="h-[1px] bg-[#d1d1d1] dark:bg-[#333] w-full mt-6" />
                </Animated.View>
                {/* Responsive Table Section with Horizontal Scroll */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-1"
                >
                    <View className="min-w-[800]">
                        {/* Table Header */}
                        <View className="flex-row border-b border-gray-100 dark:border-gray-800 pb-4 mb-2 px-4">
                            <View className="w-12">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">#</Text>
                            </View>
                            <View className="flex-[2]">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Usuario</Text>
                            </View>
                            <View className="flex-[2]">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Email</Text>
                            </View>
                            <View className="flex-[1] items-center">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Role</Text>
                            </View>
                            <View className="flex-[1] items-center">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Cuenta</Text>
                            </View>
                            <View className="flex-[1] items-end">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Acciones</Text>
                            </View>
                        </View>

                        {/* Table Body */}
                        <View className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm rounded-lg overflow-hidden">
                            {users.length > 0 ? (
                                users.map((item: any, index: number) => (
                                    <Animated.View
                                        key={item._id || index}
                                        entering={FadeInDown.duration(500).delay(200 + index * 50)}
                                        className={`flex-row p-5 items-center border-b border-gray-50 dark:border-gray-900 last:border-0`}
                                    >
                                        <View className="w-12">
                                            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-lg text-[#334155] dark:text-[#94a3b8]">{index + 1}</Text>
                                        </View>
                                        <View className="flex-[2] w-40">
                                            <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-sm text-[#1a1a1a] dark:text-[#f3f4f6]" numberOfLines={1}>
                                                {item.username}
                                            </Text>
                                        </View>
                                        <View className="flex-[2] w-40">
                                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-[#64748b] dark:text-[#9ca3af]" numberOfLines={1}>
                                                {item.email}
                                            </Text>
                                        </View>
                                        <View className="flex-[1] w-16 text-center">
                                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-xs text-left! text-[#334155] dark:text-[#cbd5e1]">
                                                {item.role || 'User'}
                                            </Text>
                                        </View>
                                        <View className="flex-[1] w-40">
                                            <Pressable
                                                onPress={() => handleToggleStatus(item._id, item.accountVerified)}
                                                className={`px-4 py-2 rounded-lg border ${item.accountVerified
                                                    ? 'border-emerald-200 bg-emerald-50/20'
                                                    : 'border-rose-100 bg-rose-50/10'
                                                    }`}
                                            >
                                                <Text style={{ fontFamily: 'Inter_500Medium' }} className={`text-[10px] ${item.accountVerified ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                    {item.accountVerified ? 'Verificada' : 'Pendiente'}
                                                </Text>
                                            </Pressable>
                                        </View>
                                        <View className="flex-[1] flex-row justify-end items-center">
                                            <Pressable
                                                onPress={() => openDeleteModal(item._id, item.username)}
                                                className="p-2 active:opacity-60"
                                            >
                                                <Trash2 size={20} color="#ef4444" strokeWidth={1.5} />
                                            </Pressable>
                                        </View>
                                    </Animated.View>
                                ))
                            ) : (
                                <View className="p-20 items-center">
                                    <UserCheck size={48} color="#cbd5e1" strokeWidth={1} />
                                    <Text className="mt-4 text-[#94a3b8] font-medium">No hay usuarios registrados.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

            </ScrollView>

            {/* MODAL DE CONFIRMACIÓN PERSONALIZADO (Cifra la experiencia en Web y Móvil) */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/60 px-6">
                    <View className="bg-white dark:bg-[#1a1a1a] w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-white/10">
                        <View className="items-center mb-6">
                            <View className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mb-4">
                                <AlertTriangle size={32} color="#ef4444" />
                            </View>
                            <Text className="text-xl font-bold text-[#111827] dark:text-[#f3f4f6] text-center">
                                ¿Estás seguro?
                            </Text>
                            <Text className="text-[#64748b] dark:text-[#9ca3af] text-center mt-2">
                                Vas a eliminar permanentemente a <Text className="font-bold text-[#ef4444]">{selectedUser?.name}</Text>. Esta acción no se puede deshacer.
                            </Text>
                        </View>

                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-[#2a2a2a] active:opacity-70"
                            >
                                <Text className="text-center font-bold text-[#64748b] dark:text-[#9ca3af]">Cancelar</Text>
                            </Pressable>

                            <Pressable
                                onPress={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-4 rounded-2xl bg-[#ef4444] active:opacity-90 shadow-lg shadow-red-500/30"
                            >
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-center font-bold text-white">Eliminar</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

