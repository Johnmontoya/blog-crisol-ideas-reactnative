import { USERS_DATA } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeleteMutation, useVerifiedMutation } from '@/queries/mutation/userMutation';
import { useGetUsersQueries } from '@/queries/query/user.query';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, Mail, RotateCcw, Shield, Trash2, User, UserCheck, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

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

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 text-[#64748b] dark:text-[#9ca3af]">Cargando usuarios...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a] p-10">
                <Shield size={48} color="#ef4444" />
                <Text className="mt-4 text-center text-[#ef4444] font-bold text-lg">Error al cargar datos</Text>
                <Text className="mt-2 text-center text-[#64748b]">No se pudo conectar con el servidor.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ padding: 20 }}
            >
                <View className="mb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-[#111827] dark:text-[#f3f4f6] font-[PlayfairDisplay_700Bold]">
                            Gestión de Usuarios
                        </Text>
                        <Text className="text-sm text-[#64748b] dark:text-[#9ca3af] mt-1">
                            Listado completo de personas registradas
                        </Text>
                    </View>
                    { (isDeleting || isToggling) && <ActivityIndicator size="small" color="#6366f1" /> }
                </View>

                {/* Table Header */}
                <View className="flex-row bg-[#6366f1] p-4 rounded-t-2xl">
                    <View className="flex-[2]">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Usuario</Text>
                    </View>
                    <View className="flex-[1.5] hidden md:flex">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Email</Text>
                    </View>
                    <View className="flex-[1] items-center">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Estado</Text>
                    </View>
                    <View className="flex-[1] items-end">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Acciones</Text>
                    </View>
                </View>

                {/* Table Body */}
                <View className="bg-white dark:bg-[#1a1a1a] rounded-b-2xl shadow-sm overflow-hidden border-x border-b border-[#eee] dark:border-[#333]">
                    {users.length > 0 ? (
                        users.map((item: any, index: number) => (
                            <View 
                                key={item._id || index}
                                className={`flex-row p-4 items-center ${
                                    index !== users.length - 1 ? 'border-b border-[#f1f5f9] dark:border-[#222]' : ''
                                }`}
                            >
                                {/* Avatar & Username */}
                                <View className="flex-[2] flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 items-center justify-center">
                                        <User size={16} color="#7c3aed" />
                                    </View>
                                    <View>
                                        <Text className="font-semibold text-[#1e293b] dark:text-[#f3f4f6]" numberOfLines={1}>
                                            {item.username}
                                        </Text>
                                        <Text className="text-[10px] text-[#64748b] md:hidden" numberOfLines={1}>
                                            {item.email}
                                        </Text>
                                    </View>
                                </View>

                                {/* Email - Hidden on small screens to avoid crowding */}
                                <View className="flex-[1.5] hidden md:flex">
                                    <Text className="text-xs text-[#64748b] dark:text-[#9ca3af]" numberOfLines={1}>
                                        {item.email}
                                    </Text>
                                </View>

                                {/* Verification Status */}
                                <View className="flex-[1] items-center">
                                    {item.accountVerified ? (
                                        <CheckCircle size={18} color="#10b981" />
                                    ) : (
                                        <XCircle size={18} color="#ef4444" />
                                    )}
                                </View>

                                {/* Actions Column */}
                                <View className="flex-[1] flex-row justify-end gap-3">
                                    <Pressable 
                                        onPress={() => handleToggleStatus(item._id, item.accountVerified)}
                                        className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg active:opacity-60"
                                    >
                                        <RotateCcw size={16} color="#3b82f6" />
                                    </Pressable>
                                    <Pressable 
                                        onPress={() => openDeleteModal(item._id, item.username)}
                                        className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg active:opacity-60"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="p-10 items-center">
                            <UserCheck size={40} color="#cbd5e1" />
                            <Text className="mt-2 text-[#94a3b8]">No hay usuarios registrados.</Text>
                        </View>
                    )}
                </View>
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
