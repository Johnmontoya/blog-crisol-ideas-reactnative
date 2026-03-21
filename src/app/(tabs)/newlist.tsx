import { NEWS_DATA } from '@/constants/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDeleteNewsMutation, useStateNewsMutation } from '@/queries/mutation/newsMutation';
import { useGetNewsQueries } from '@/queries/query/news.query';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, CheckCircle, Eye, EyeOff, ImageIcon, List, Newspaper, Quote, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';

export default function NewListScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const queryClient = useQueryClient();
    
    // Fetch news
    const [newsQuery] = useGetNewsQueries();
    const { data: newsResponse, isLoading, isError, refetch } = newsQuery;
    const newsItems = newsResponse?.news || [];

    // Estado para el modal de confirmación
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState<{ id: string, title: string } | null>(null);

    // Mutaciones
    const { mutate: deleteNews, isPending: isDeleting } = useDeleteNewsMutation();
    const { mutate: toggleStatus, isPending: isToggling } = useStateNewsMutation();

    const openDeleteModal = (id: string, title: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedNews({ id, title });
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (!selectedNews) return;
        
        deleteNews({ id: selectedNews.id }, {
            onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                queryClient.invalidateQueries({ queryKey: [NEWS_DATA] });
                setModalVisible(false);
                setSelectedNews(null);
            },
            onError: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        });
    };

    const handleToggleStatus = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleStatus({ id }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [NEWS_DATA] });
            },
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'hero-image': return <ImageIcon size={16} color="#3b82f6" />;
            case 'bullet-list': return <List size={16} color="#10b981" />;
            case 'quote-block': return <Quote size={16} color="#f59e0b" />;
            default: return <Newspaper size={16} color="#7c3aed" />;
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 text-[#64748b] dark:text-[#9ca3af]">Cargando noticias...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-[#f8f9fa] dark:bg-[#0a0a0a] p-10">
                <AlertTriangle size={48} color="#ef4444" />
                <Text className="mt-4 text-center text-[#ef4444] font-bold text-lg">Error al cargar noticias</Text>
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
                            Gestión de Noticias
                        </Text>
                        <Text className="text-sm text-[#64748b] dark:text-[#9ca3af] mt-1">
                            Controla el contenido destacado de tu app
                        </Text>
                    </View>
                    { (isDeleting || isToggling) && <ActivityIndicator size="small" color="#6366f1" /> }
                </View>

                {/* Table Header */}
                <View className="flex-row bg-[#6366f1] p-4 rounded-t-2xl">
                    <View className="flex-[2.5]">
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">Noticia</Text>
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
                    {newsItems.length > 0 ? (
                        newsItems.map((item: any, index: number) => (
                            <View 
                                key={item._id || index}
                                className={`flex-row p-4 items-center ${
                                    index !== newsItems.length - 1 ? 'border-b border-[#f1f5f9] dark:border-[#222]' : ''
                                }`}
                            >
                                {/* Thumbnail & Info */}
                                <View className="flex-[2.5] flex-row items-center gap-3">
                                    <View className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/10 items-center justify-center overflow-hidden">
                                        {item.type === 'hero-image' && item.contentHero?.imageUrl ? (
                                            <Image 
                                                source={{ uri: item.contentHero.imageUrl }} 
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit="cover"
                                            />
                                        ) : (
                                            getIcon(item.type)
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-[#1e293b] dark:text-[#f3f4f6]" numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text className="text-[10px] text-[#64748b]" numberOfLines={1}>
                                            {item.category} • {item.type.replace('-', ' ')}
                                        </Text>
                                    </View>
                                </View>

                                {/* Publish Status */}
                                <View className="flex-[1] items-center">
                                    {item.isPublished ? (
                                        <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                            <CheckCircle size={10} color="#10b981" />
                                            <Text className="text-[9px] text-emerald-600 font-bold ml-1">Live</Text>
                                        </View>
                                    ) : (
                                        <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">
                                            <EyeOff size={10} color="#d97706" />
                                            <Text className="text-[9px] text-amber-600 font-bold ml-1">Draft</Text>
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
                            <Newspaper size={40} color="#cbd5e1" />
                            <Text className="mt-2 text-[#94a3b8]">No has publicado noticias aún.</Text>
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
                                ¿Borrar noticia?
                            </Text>
                            <Text className="text-[#64748b] dark:text-[#9ca3af] text-center mt-2">
                                Vas a eliminar permanentemente "<Text className="font-bold text-[#ef4444]">{selectedNews?.title}</Text>".
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