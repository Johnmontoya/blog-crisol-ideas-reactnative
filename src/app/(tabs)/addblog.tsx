import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCreateBlogMutation, useGenerateAIMutation } from '@/queries/mutation/blogMutation';
import { useAuthStore } from '@/store/auth';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, CheckCircle, FileText, Layout, Sparkles, Tag, Type, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function AddBlogScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const { userId } = useAuthStore();
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    // Mutaciones
    const { mutate: createBlog, isPending: isCreating } = useCreateBlogMutation();
    const { mutate: generateAI, isPending: isGenerating } = useGenerateAIMutation();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleGenerateAI = () => {
        if (!title && !category) {
            Alert.alert("Aviso", "Por favor ingresa un título o categoría para orientar a la IA.");
            return;
        }

        const prompt = `Escribe un blog sobre ${title || category}. Incluye un subtítulo interesante.`;

        generateAI(prompt, {
            onSuccess: (response: any) => {
                if (response.data?.content) {
                    setDescription(response.data.content);
                    Alert.alert("¡Magia lista!", "La IA ha generado el contenido por ti.");
                }
            },
            onError: () => {
                Alert.alert("Error", "No se pudo generar el contenido con IA.");
            }
        });
    };

    const handleSubmit = () => {
        if (!title || !description || !category) {
            Alert.alert("Error", "Los campos Título, Categoría y Contenido son obligatorios.");
            return;
        }

        if (!image) {
            Alert.alert("Error", "Debes seleccionar una imagen para la portada.");
            return;
        }

        const Data = {
            userId: userId,
            title: title,
            subTitle: subTitle,
            description: description,
            category: category,
            isPublished: true,
            createdAt: new Date().toISOString(),
        };

        const formData = new FormData();
        formData.append("blog", JSON.stringify(Data));
        formData.append("image", image!);

        createBlog(formData, {
            onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setSuccessModalVisible(true);
                // Limpiar campos
                setTitle('');
                setSubTitle('');
                setCategory('');
                setDescription('');
                setImage(null);
            },
            onError: (error: any) => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert("Error", "Ocurrió un error al publicar el blog.");
            }
        });
    };

    return (
        <ScrollView className="flex-1 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
            <View className="p-6 pb-20">
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-2xl font-bold text-[#111827] dark:text-[#f3f4f6] font-[PlayfairDisplay_700Bold]">
                            Nueva Publicación
                        </Text>
                        <Text className="text-sm text-[#64748b] dark:text-[#9ca3af] mt-1">
                            Diseña tu blog con inteligencia
                        </Text>
                    </View>
                    <Pressable
                        onPress={handleGenerateAI}
                        disabled={isGenerating}
                        className="w-12 h-12 rounded-2xl bg-violet-600 items-center justify-center shadow-lg shadow-violet-500/50 active:scale-95"
                    >
                        {isGenerating ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Sparkles size={24} color="#fff" />
                        )}
                    </Pressable>
                </View>

                {/* Portada Selector */}
                <View className="mb-8">
                    {image ? (
                        <View className="w-full h-48 rounded-[32px] overflow-hidden relative shadow-lg shadow-black/10">
                            <Image
                                source={{ uri: image }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                            />
                            <Pressable
                                onPress={() => setImage(null)}
                                className="absolute top-3 right-3 w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-md"
                            >
                                <X size={20} color="#fff" />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable
                            onPress={pickImage}
                            className="w-full h-48 rounded-[32px] border-2 border-dashed border-violet-300 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-900/10 items-center justify-center"
                        >
                            <View className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-full items-center justify-center mb-3">
                                <Camera size={28} color="#7c3aed" />
                            </View>
                            <Text className="text-violet-600 dark:text-violet-400 font-bold">Seleccionar Portada</Text>
                            <Text className="text-violet-400 text-xs mt-1">Formatos JPG, PNG (Max 5MB)</Text>
                        </Pressable>
                    )}
                </View>

                {/* Form Fields */}
                <View className="gap-5">
                    {/* Title */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                            <Type size={16} color="#6366f1" />
                            <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">Título</Text>
                        </View>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Escribe el título aquí..."
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                        />
                    </View>

                    {/* Subtitle */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                            <Layout size={16} color="#6366f1" />
                            <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">Subtítulo</Text>
                        </View>
                        <TextInput
                            value={subTitle}
                            onChangeText={setSubTitle}
                            placeholder="Un pequeño resumen..."
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                        />
                    </View>

                    {/* Category */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                            <Tag size={16} color="#6366f1" />
                            <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">Categoría</Text>
                        </View>
                        <TextInput
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Tecnología, Arte, Viajes..."
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6]"
                        />
                    </View>

                    {/* Content Body */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-2 ml-1">
                            <FileText size={16} color="#6366f1" />
                            <Text className="text-sm font-semibold text-[#475569] dark:text-[#94a3b8]">Contenido</Text>
                        </View>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                            placeholder="El cuerpo de tu publicación..."
                            placeholderTextColor="#94a3b8"
                            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-[#eee] dark:border-[#333] text-[#1e293b] dark:text-[#f3f4f6] min-h-[160px]"
                        />
                    </View>
                </View>

                {/* Submit Button */}
                <Pressable
                    onPress={handleSubmit}
                    disabled={isCreating}
                    className="mt-10 bg-violet-600 p-5 rounded-[22px] flex-row items-center justify-center shadow-xl shadow-violet-500/40 active:opacity-90"
                >
                    {isCreating ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2">Publicar Blog</Text>
                            <Sparkles size={20} color="#fff" />
                        </>
                    )}
                </Pressable>
            </View>

            {/* MODAL DE ÉXITO PERSONALIZADO */}
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
                                ¡Publicado con Éxito!
                            </Text>
                            <Text className="text-[#64748b] dark:text-[#9ca3af] text-center mt-3 text-base">
                                Tu nueva joya literaria ya está disponible para todo el mundo. ¡Sigue creando!
                            </Text>
                        </View>

                        <Pressable 
                            onPress={() => setSuccessModalVisible(false)}
                            className="w-full py-4 rounded-2xl bg-violet-600 active:opacity-90 shadow-lg shadow-violet-500/30"
                        >
                            <Text className="text-center font-bold text-white text-lg">Entendido</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
