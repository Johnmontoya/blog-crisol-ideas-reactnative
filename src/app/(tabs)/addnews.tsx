import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCreateNewsMutation } from '@/queries/mutation/newsMutation';
import * as Haptics from 'expo-haptics';
import { CheckCircle, Image as ImageIcon, Layout, List, Newspaper, Quote, Tag, Type } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const NEWS_TYPES = [
    { value: 'hero-image', label: 'Imagen Destacada', icon: ImageIcon, color: '#3b82f6' },
    { value: 'bullet-list', label: 'Lista de Puntos', icon: List, color: '#10b981' },
    { value: 'quote-block', label: 'Cita Destacada', icon: Quote, color: '#f59e0b' },
];

export default function AddNewsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const [type, setType] = useState('hero-image');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [isPublished, setIsPublished] = useState(true);

    // Dynamic Fields
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [quoteText, setQuoteText] = useState('');
    const [context, setContext] = useState('');
    const [points, setPoints] = useState('');
    const [author, setAuthor] = useState('');

    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const { mutate: createNews, isPending } = useCreateNewsMutation();

    const handleSubmit = () => {
        if (!title || !category) {
            Alert.alert("Error", "El título y la categoría son obligatorios.");
            return;
        }

        // Validaciones dinámicas
        if (type === 'hero-image' && (!imageUrl || !description)) {
            Alert.alert("Error", "La URL de imagen y descripción son obligatorias.");
            return;
        }
        if (type === 'quote-block' && (!quoteText || !context)) {
            Alert.alert("Error", "El texto de la cita y el contexto son obligatorios.");
            return;
        }
        if (type === 'bullet-list' && (!points || !author)) {
            Alert.alert("Error", "Los puntos y el autor son obligatorios.");
            return;
        }

        const payload: any = {
            type,
            category,
            title,
            isPublished,
            createdAt: new Date().toISOString(),
        };

        if (type === 'hero-image') {
            payload.contentHero = { imageUrl, description };
        } else if (type === 'quote-block') {
            payload.contentQuote = { quoteText, context };
        } else if (type === 'bullet-list') {
            payload.contentBullet = { points, author };
        }

        createNews(payload, {
            onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setSuccessModalVisible(true);
                // Reset fields
                setTitle('');
                setCategory('');
                setImageUrl('');
                setDescription('');
                setQuoteText('');
                setContext('');
                setPoints('');
                setAuthor('');
            },
            onError: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert("Error", "No se pudo crear la noticia.");
            }
        });
    };

    return (
        <ScrollView className="flex-1 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            <View className="p-6 pb-20">
                <View className="mb-8">
                    <Text className="text-2xl font-bold text-[#111827] dark:text-[#f3f4f6] font-[PlayfairDisplay_700Bold]">
                        Crear Noticia
                    </Text>
                    <Text className="text-sm text-[#64748b] dark:text-[#9ca3af] mt-1">
                        Publica contenido dinámico en tu feed
                    </Text>
                </View>

                {/* News Type Selector */}
                <View className="mb-8">
                    <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8] mb-4 ml-1">Tipo de Noticia</Text>
                    <View className="flex-row gap-3">
                        {NEWS_TYPES.map((t) => (
                            <Pressable
                                key={t.value}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setType(t.value);
                                }}
                                className={`flex-1 p-4 rounded-3xl border-2 items-center justify-center ${type === t.value
                                        ? 'bg-violet-50 border-violet-600 dark:bg-violet-900/10'
                                        : 'bg-white border-[#eee] dark:bg-[#1a1a1a] dark:border-[#333]'
                                    }`}
                            >
                                <t.icon size={24} color={type === t.value ? '#7c3aed' : '#94a3b8'} />
                                <Text className={`text-[10px] font-bold mt-2 text-center ${type === t.value ? 'text-violet-600' : 'text-[#94a3b8]'
                                    }`}>
                                    {t.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Common Fields */}
                <View className="gap-5">
                    <View>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                            <Type size={16} color="#6366f1" />
                            <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">Título</Text>
                        </View>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Título de la noticia..."
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                        />
                    </View>

                    <View>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                            <Tag size={16} color="#6366f1" />
                            <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">Categoría</Text>
                        </View>
                        <TextInput
                            value={category}
                            onChangeText={setCategory}
                            placeholder="General, Actualidad..."
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                        />
                    </View>

                    {/* Dynamic Fields Section */}
                    <View className="mt-2 pt-6 border-t border-[#eee] dark:border-[#333]">
                        <View className="flex-row items-center gap-2 mb-6">
                            <Layout size={18} color="#7c3aed" />
                            <Text className="text-base font-bold text-[#1e293b] dark:text-[#f3f4f6]">Contenido Específico</Text>
                        </View>

                        {type === 'hero-image' && (
                            <View className="gap-5">
                                <View>
                                    <Text className="text-xs font-semibold text-[#64748b] mb-2 ml-1">URL de la Imagen</Text>
                                    <TextInput
                                        value={imageUrl}
                                        onChangeText={setImageUrl}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        placeholderTextColor="#94a3b8"
                                        className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                                    />
                                </View>
                                <View>
                                    <Text className="text-xs font-semibold text-[#64748b] mb-2 ml-1">Descripción de la Imagen</Text>
                                    <TextInput
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        placeholder="Pequeña descripción..."
                                        placeholderTextColor="#94a3b8"
                                        className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6] min-h-[100px]"
                                    />
                                </View>
                            </View>
                        )}

                        {type === 'quote-block' && (
                            <View className="gap-5">
                                <View>
                                    <Text className="text-xs font-semibold text-[#64748b] mb-2 ml-1">Texto de la Cita</Text>
                                    <TextInput
                                        value={quoteText}
                                        onChangeText={setQuoteText}
                                        multiline
                                        placeholder="La frase célebre..."
                                        placeholderTextColor="#94a3b8"
                                        className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6] min-h-[100px]"
                                    />
                                </View>
                                <View>
                                    <Text className="text-xs font-semibold text-[#64748b] mb-2 ml-1">Contexto / Autor de la cita</Text>
                                    <TextInput
                                        value={context}
                                        onChangeText={setContext}
                                        placeholder="Quién lo dijo o dónde..."
                                        placeholderTextColor="#94a3b8"
                                        className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                                    />
                                </View>
                            </View>
                        )}

                        {type === 'bullet-list' && (
                            <View className="gap-5">
                                <View>
                                    <Text className="text-xs font-semibold text-[#64748b] mb-2 ml-1">Puntos / Lista</Text>
                                    <TextInput
                                        value={points}
                                        onChangeText={setPoints}
                                        multiline
                                        placeholder="Notas separadas por comas"
                                        placeholderTextColor="#94a3b8"
                                        className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6] min-h-[120px]"
                                    />
                                </View>
                                <View>
                                    <Text className="text-xs font-semibold text-[#64748b] mb-2 ml-1">Responsable / Autor</Text>
                                    <TextInput
                                        value={author}
                                        onChangeText={setAuthor}
                                        placeholder="Nombre del autor..."
                                        placeholderTextColor="#94a3b8"
                                        className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Submit Button */}
                <Pressable
                    onPress={handleSubmit}
                    disabled={isPending}
                    className="mt-12 bg-[#6366f1] p-5 rounded-[22px] flex-row items-center justify-center shadow-xl shadow-blue-500/40 active:opacity-90"
                >
                    {isPending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2">Publicar Noticia</Text>
                            <Newspaper size={20} color="#fff" />
                        </>
                    )}
                </Pressable>
            </View>

            {/* MODAL DE ÉXITO */}
            <Modal
                transparent={true}
                visible={successModalVisible}
                animationType="fade"
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/60 px-6">
                    <View className="bg-white dark:bg-[#1a1a1a] w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-white/10">
                        <View className="items-center mb-6">
                            <View className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center mb-4">
                                <CheckCircle size={48} color="#10b981" />
                            </View>
                            <Text className="text-2xl font-bold text-[#111827] dark:text-[#f3f4f6] text-center font-[PlayfairDisplay_700Bold]">
                                ¡Noticia Creada!
                            </Text>
                            <Text className="text-[#64748b] dark:text-[#9ca3af] text-center mt-3 text-base">
                                Tu contenido se ha compartido correctamente con tus seguidores.
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => setSuccessModalVisible(false)}
                            className="w-full py-4 rounded-2xl bg-[#6366f1] active:opacity-90 shadow-lg shadow-blue-500/30"
                        >
                            <Text className="text-center font-bold text-white text-lg">Excelente</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}