import { COMMENT_DATA } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeleteCommentMutation, useStateCommentMutation } from '@/queries/mutation/commentMutation';
import { useGetCommentUserIdQueries } from '@/queries/query/comment.query';
import { useAuthStore } from '@/store/auth';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, CheckCircle, MessageSquare, Trash2, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

export default function CommentScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();
    
    // Fetch comments
    const [commentsQuery] = useGetCommentUserIdQueries(userId);
    const { data: commentsData, isLoading, isError, refetch } = commentsQuery;
    const comments = commentsData?.comments || [];

    // Estado para el modal de confirmación
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState<{ id: string, content: string } | null>(null);

    // Mutaciones
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteCommentMutation();
    const { mutate: toggleStatus, isPending: isToggling } = useStateCommentMutation();

    const openDeleteModal = (commentId: string, content: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedComment({ id: commentId, content });
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (!selectedComment) return;
        
        deleteComment({ id: selectedComment.id }, {
            onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                queryClient.invalidateQueries({ queryKey: [COMMENT_DATA] });
                setModalVisible(false);
                setSelectedComment(null);
            },
            onError: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        });
    };

    const handleToggleStatus = (commentId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleStatus({ id: commentId }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [COMMENT_DATA] });
            },
        });
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 text-[#64748b] dark:text-[#9ca3af]">Cargando comentarios...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a] p-10">
                <AlertTriangle size={48} color="#ef4444" />
                <Text className="mt-4 text-center text-[#ef4444] font-bold text-lg">Error al cargar comentarios</Text>
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
                            Gestión de Comentarios
                        </Text>
                        <Text className="text-sm text-[#64748b] dark:text-[#9ca3af] mt-1">
                            Modera las opiniones de tus lectores
                        </Text>
                    </View>
                    { (isDeleting || isToggling) && <ActivityIndicator size="small" color="#6366f1" /> }
                </View>

                {/* Table Header */}
                <View className="flex-row bg-[#6366f1] p-4 rounded-t-2xl">
                    <View className="flex-[2.5]">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Comentario</Text>
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
                    {comments.length > 0 ? (
                        comments.map((item: any, index: number) => (
                            <View 
                                key={item._id || index}
                                className={`flex-row p-4 items-center ${
                                    index !== comments.length - 1 ? 'border-b border-[#f1f5f9] dark:border-[#222]' : ''
                                }`}
                            >
                                {/* Comment Content & Blog Info */}
                                <View className="flex-[2.5] flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 items-center justify-center">
                                        <MessageSquare size={16} color="#7c3aed" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-[#1e293b] dark:text-[#f3f4f6] text-xs" numberOfLines={2}>
                                            {item.content}
                                        </Text>
                                        <Text className="text-[10px] text-violet-600 dark:text-violet-400 mt-1 italic" numberOfLines={1}>
                                            en: {item.blog?.title || 'Blog desconocido'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Approval Status */}
                                <View className="flex-[1] items-center">
                                    {item.isApproved ? (
                                        <CheckCircle size={18} color="#10b981" />
                                    ) : (
                                        <XCircle size={18} color="#d97706" />
                                    )}
                                </View>

                                {/* Actions Column */}
                                <View className="flex-[1] flex-row justify-end gap-2">
                                    <Pressable 
                                        onPress={() => handleToggleStatus(item._id)}
                                        className={`p-2 rounded-lg active:opacity-60 ${
                                            item.isApproved ? 'bg-amber-50 dark:bg-amber-900/10' : 'bg-emerald-50 dark:bg-emerald-900/10'
                                        }`}
                                    >
                                        <Text className={`text-[10px] font-bold ${item.isApproved ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {item.isApproved ? 'Ocultar' : 'Aprobar'}
                                        </Text>
                                    </Pressable>
                                    <Pressable 
                                        onPress={() => openDeleteModal(item._id, item.content)}
                                        className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg active:opacity-60"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="p-10 items-center">
                            <MessageSquare size={40} color="#cbd5e1" />
                            <Text className="mt-2 text-[#94a3b8]">No hay comentarios aún.</Text>
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
                                ¿Eliminar comentario?
                            </Text>
                            <Text className="text-[#64748b] dark:text-[#9ca3af] text-center mt-2" numberOfLines={3}>
                                "{selectedComment?.content}"
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