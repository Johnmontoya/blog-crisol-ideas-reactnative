import { COMMENT_DATA } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeleteCommentMutation, useStateCommentMutation } from '@/queries/mutation/commentMutation';
import { useGetCommentUserIdQueries } from '@/queries/query/comment.query';
import { useAuthStore } from '@/store/auth';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts as useInterFonts
} from '@expo-google-fonts/inter';
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    useFonts as usePlayfairFonts
} from '@expo-google-fonts/playfair-display';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, CheckCircle, MessageSquare, Trash2, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function CommentScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();
    
    // Fetch comments
    const [commentsQuery] = useGetCommentUserIdQueries(userId);
    const { data: commentsData, isLoading, isError, refetch } = commentsQuery;
    const comments = commentsData?.comments || (Array.isArray(commentsData) ? commentsData : []);

    // Estado para el modal de confirmación
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComment, setSelectedComment] = useState<{ id: string, content: string } | null>(null);

    // Mutaciones
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteCommentMutation();
    const { mutate: toggleStatus, isPending: isToggling } = useStateCommentMutation();

    const [playfairLoaded] = usePlayfairFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
    });

    const [interLoaded] = useInterFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const openDeleteModal = (commentId: string, content: string) => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {}
        setSelectedComment({ id: commentId, content });
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (!selectedComment) return;
        
        deleteComment({ id: selectedComment.id }, {
            onSuccess: () => {
                try {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (e) {}
                queryClient.invalidateQueries({ queryKey: [COMMENT_DATA] });
                setModalVisible(false);
                setSelectedComment(null);
            },
            onError: () => {
                try {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                } catch (e) {}
            }
        });
    };

    const handleToggleStatus = (commentId: string) => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {}
        toggleStatus({ id: commentId }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [COMMENT_DATA] });
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
                <AlertTriangle size={48} color="#ef4444" />
                <Text className="mt-4 text-center text-[#ef4444] font-bold text-lg">Error al cargar comentarios</Text>
                <Pressable 
                    onPress={() => refetch()}
                    className="mt-6 px-8 py-4 bg-black dark:bg-white rounded-2xl shadow-lg"
                >
                    <Text className="text-white dark:text-black font-bold">Reintentar</Text>
                </Pressable>
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
                    className="mb-10"
                >
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                        className="text-6xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tighter"
                    >
                        Moderación.
                    </Text>
                    <Text
                        style={{ fontFamily: 'Inter_400Regular' }}
                        className="text-lg text-[#666] dark:text-[#999] mt-3"
                    >
                        Gestiona y modera las opiniones de tus lectores para mantener una comunidad sana.
                    </Text>
                    <View className="h-[1px] bg-[#d1d1d1] dark:bg-[#333] w-full mt-8" />
                </Animated.View>

                {/* Table Horizontal view */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="min-w-[850]">
                        {/* Table Header Labels */}
                        <View className="flex-row border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 px-4">
                            <View className="w-12">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">#</Text>
                            </View>
                            <View className="flex-[3]">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Comentario / Fuente</Text>
                            </View>
                            <View className="flex-[1.5] items-center">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Visibilidad</Text>
                            </View>
                            <View className="flex-[1] items-end">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#64748b] text-[10px] tracking-widest uppercase">Acciones</Text>
                            </View>
                        </View>

                        {/* Table Items Container */}
                        <View className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden">
                            {comments.length > 0 ? (
                                comments.map((item: any, index: number) => (
                                    <Animated.View 
                                        key={item._id || index}
                                        entering={FadeInDown.duration(500).delay(200 + index * 50)}
                                        className="flex-row p-5 items-center border-b border-gray-50 dark:border-gray-900 last:border-0"
                                    >
                                        <View className="w-12">
                                            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-xl text-[#c1c1c1] dark:text-[#444]">
                                                {String(index + 1).padStart(2, '0')}
                                            </Text>
                                        </View>

                                        {/* Comment Content & Context */}
                                        <View className="flex-[3] flex-row items-center gap-4">
                                            <View className="w-12 h-12 rounded-2xl bg-[#f8fafc] dark:bg-[#121212] border border-gray-100 dark:border-gray-800 items-center justify-center">
                                                <MessageSquare size={18} color="#7c3aed" />
                                            </View>
                                            <View className="flex-1">
                                                <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-sm text-[#1a1a1a] dark:text-[#f3f4f6]" numberOfLines={2}>
                                                    {item.content}
                                                </Text>
                                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[10px] text-violet-600 dark:text-violet-400 mt-1 italic" numberOfLines={1}>
                                                    en: {item.blog?.title || 'Artículo desconocido'}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Status Toggle */}
                                        <View className="flex-[1.5] items-center">
                                            <Pressable 
                                                onPress={() => handleToggleStatus(item._id)}
                                                className={`px-4 py-2 rounded-xl border ${item.isApproved 
                                                    ? 'border-emerald-200 bg-emerald-50/20' 
                                                    : 'border-amber-100 bg-amber-50/10'
                                                }`}
                                            >
                                                <View className="flex-row items-center gap-1.5">
                                                    {item.isApproved 
                                                        ? <CheckCircle size={12} color="#10b981" /> 
                                                        : <XCircle size={12} color="#d97706" />
                                                    }
                                                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className={`text-[10px] uppercase ${item.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                        {item.isApproved ? 'Aprobado' : 'Pendiente'}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        </View>

                                        {/* Actions */}
                                        <View className="flex-[1] flex-row justify-end items-center">
                                            <Pressable 
                                                onPress={() => openDeleteModal(item._id, item.content)}
                                                className="w-10 h-10 bg-rose-50 dark:bg-rose-900/10 rounded-full items-center justify-center active:opacity-60"
                                            >
                                                <Trash2 size={18} color="#ef4444" strokeWidth={1.5} />
                                            </Pressable>
                                        </View>
                                    </Animated.View>
                                ))
                            ) : (
                                <View className="p-20 items-center">
                                    <MessageSquare size={48} color="#cbd5e1" strokeWidth={1} />
                                    <Text style={{ fontFamily: 'Inter_500Medium' }} className="mt-4 text-[#94a3b8]">No hay comentarios pendientes.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </ScrollView>

            {/* CONFIRMATION MODAL */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/60 px-6">
                    <View className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-[40px] p-8 shadow-2xl border border-white/10">
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mb-6">
                                <AlertTriangle size={36} color="#ef4444" />
                            </View>
                            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-2xl text-[#111827] dark:text-[#f3f4f6] text-center">
                                ¿Borrar comentario?
                            </Text>
                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[#64748b] dark:text-[#9ca3af] text-center mt-3 leading-6 px-4" numberOfLines={4}>
                                "{selectedComment?.content}"
                            </Text>
                        </View>

                        <View className="flex-row gap-4">
                            <Pressable 
                                onPress={() => setModalVisible(false)}
                                className="flex-1 py-5 rounded-[22px] bg-gray-100 dark:bg-[#2a2a2a] active:opacity-70"
                            >
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-center text-[#64748b] dark:text-[#9ca3af]">Cancelar</Text>
                            </Pressable>
                            
                            <Pressable 
                                onPress={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-5 rounded-[22px] bg-[#ef4444] active:opacity-90 shadow-xl shadow-red-500/20"
                            >
                                {isDeleting ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-center text-white">Eliminar</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}