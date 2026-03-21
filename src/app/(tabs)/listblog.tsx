import { BLOG_DATA } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeleteBlogMutation, useToggleBlogMutation } from '@/queries/mutation/blogMutation';
import { useGetOwnBlogQueries } from '@/queries/query/blog.query';
import { useAuthStore } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, BookOpen, CheckCircle, Eye, EyeOff, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

export default function ListBlogScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();
    
    // Fetch blogs
    const { data: blogsData, isLoading, isError, refetch } = useGetOwnBlogQueries(userId);
    const blogs = blogsData?.blogs || [];

    // Estado para el modal de confirmación
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<{ id: string, title: string } | null>(null);

    // Mutaciones
    const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlogMutation();
    const { mutate: toggleStatus, isPending: isToggling } = useToggleBlogMutation();

    const openDeleteModal = (blogId: string, title: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedBlog({ id: blogId, title });
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (!selectedBlog) return;
        
        deleteBlog({ id: selectedBlog.id }, {
            onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                queryClient.invalidateQueries({ queryKey: [BLOG_DATA, userId] });
                setModalVisible(false);
                setSelectedBlog(null);
            },
            onError: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        });
    };

    const handleToggleStatus = (blogId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleStatus({ id: blogId }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [BLOG_DATA, userId] });
            },
        });
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 text-[#64748b] dark:text-[#9ca3af]">Cargando tus publicaciones...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a] p-10">
                <AlertTriangle size={48} color="#ef4444" />
                <Text className="mt-4 text-center text-[#ef4444] font-bold text-lg">Error al cargar blogs</Text>
                <Pressable 
                    onPress={() => refetch()}
                    className="mt-6 px-6 py-3 bg-violet-600 rounded-xl"
                >
                    <Text className="text-white font-bold">Reintentar</Text>
                </Pressable>
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
                            Mis Publicaciones
                        </Text>
                        <Text className="text-sm text-[#64748b] dark:text-[#9ca3af] mt-1">
                            Gestiona y edita tus historias
                        </Text>
                    </View>
                    { (isDeleting || isToggling) && <ActivityIndicator size="small" color="#6366f1" /> }
                </View>

                {/* Table Header */}
                <View className="flex-row bg-[#6366f1] p-4 rounded-t-2xl">
                    <View className="flex-[2]">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Publicación</Text>
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
                    {blogs.length > 0 ? (
                        blogs.map((item: any, index: number) => (
                            <View 
                                key={item._id || index}
                                className={`flex-row p-4 items-center ${
                                    index !== blogs.length - 1 ? 'border-b border-[#f1f5f9] dark:border-[#222]' : ''
                                }`}
                            >
                                {/* Title & Category */}
                                <View className="flex-[2] flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 items-center justify-center">
                                        <BookOpen size={16} color="#7c3aed" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-[#1e293b] dark:text-[#f3f4f6]" numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text className="text-[10px] text-[#64748b]" numberOfLines={1}>
                                            {item.category}
                                        </Text>
                                    </View>
                                </View>

                                {/* Publish Status */}
                                <View className="flex-[1] items-center">
                                    {item.isPublished ? (
                                        <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                            <CheckCircle size={12} color="#10b981" />
                                            <Text className="text-[10px] text-emerald-600 font-bold ml-1">Público</Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                                            <EyeOff size={12} color="#d97706" />
                                            <Text className="text-[10px] text-amber-600 font-bold ml-1">Oculto</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Actions Column */}
                                <View className="flex-[1] flex-row justify-end gap-2">
                                    <Pressable 
                                        onPress={() => handleToggleStatus(item._id)}
                                        className={`p-2 rounded-lg active:opacity-60 ${
                                            item.isPublished ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-emerald-50 dark:bg-emerald-900/10'
                                        }`}
                                    >
                                        {item.isPublished ? <EyeOff size={16} color="#d97706" /> : <Eye size={16} color="#10b981" />}
                                    </Pressable>
                                    <Pressable 
                                        onPress={() => openDeleteModal(item._id, item.title)}
                                        className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg active:opacity-60"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="p-10 items-center">
                            <BookOpen size={40} color="#cbd5e1" />
                            <Text className="mt-2 text-[#94a3b8]">No tienes publicaciones aún.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
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
                                ¿Eliminar publicación?
                            </Text>
                            <Text className="text-[#64748b] dark:text-[#9ca3af] text-center mt-2">
                                Estás a punto de borrar "<Text className="font-bold text-[#ef4444]">{selectedBlog?.title}</Text>". Esta acción es permanente.
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