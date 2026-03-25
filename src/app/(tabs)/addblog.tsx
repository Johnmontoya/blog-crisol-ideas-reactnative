import AnimatedPressable from '@/components/ui/AnimatedPressable';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCreateBlogMutation, useGenerateAIMutation } from '@/queries/mutation/blogMutation';
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
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CheckCircle, FileText, Image as ImageIcon, Sparkles, Tag, Type, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View, Image as RNImage } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function AddBlogScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const { userId } = useAuthStore();
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    // Mutaciones
    const { mutate: createBlog, isPending: isCreating } = useCreateBlogMutation();
    const { mutate: generateAI, isPending: isGenerating } = useGenerateAIMutation();

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

    const pickImage = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {}
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleGenerateAI = () => {
        if (!title && !category) {
            Alert.alert("Aviso", "Por favor ingresa un título o categoría para orientar a la IA.");
            return;
        }

        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {}

        const prompt = `Escribe un blog sobre ${title || category}. Incluye un subtítulo interesante.`;

        generateAI(prompt, {
            onSuccess: (response: any) => {
                if (response.data?.content) {
                    setDescription(response.data.content);
                    try {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    } catch (e) {}
                    Alert.alert("¡Magia lista!", "La IA ha generado el contenido por ti.");
                }
            },
            onError: () => {
                try {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                } catch (e) {}
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
        
        if (image) {
            if (image.file) {
                formData.append("image", image.file);
            } else {
                const fileName = image.uri.split('/').pop() || 'photo.jpg';
                const fileType = image.mimeType || 'image/jpeg';
                
                // @ts-ignore
                formData.append("image", {
                    uri: image.uri,
                    name: fileName,
                    type: fileType,
                });
            }
        }

        createBlog(formData, {
            onSuccess: () => {
                try {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch (e) {}
                setSuccessModalVisible(true);
                setTitle('');
                setSubTitle('');
                setCategory('');
                setDescription('');
                setImage(null);
            },
            onError: () => {
                try {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                } catch (e) {}
                Alert.alert("Error", "Ocurrió un error al publicar el blog.");
            }
        });
    };

    if (!playfairLoaded || !interLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView 
            className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]"
            showsVerticalScrollIndicator={false}
        >
            <View className="p-6 pb-24 pt-10">
                {/* Header Section */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(100)}
                    className="mb-10"
                >
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 pr-4">
                            <Text
                                style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                                className="text-5xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tighter"
                            >
                                Nuevo Blog.
                            </Text>
                            <Text
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="text-lg text-[#666] dark:text-[#999] mt-2"
                            >
                                Crea historias memorables y compártelas con el mundo.
                            </Text>
                        </View>
                        <AnimatedPressable
                            onPress={handleGenerateAI}
                            disabled={isGenerating}
                            className="w-14 h-14 rounded-[20px] bg-black dark:bg-white items-center justify-center shadow-2xl active:scale-90"
                        >
                            {isGenerating ? (
                                <ActivityIndicator color={colorScheme === 'dark' ? '#000' : '#fff'} size="small" />
                            ) : (
                                <Sparkles size={24} color={colorScheme === 'dark' ? '#000' : '#fff'} />
                            )}
                        </AnimatedPressable>
                    </View>
                    <View className="h-[1px] bg-[#d1d1d1] dark:bg-[#333] w-full mt-8" />
                </Animated.View>

                {/* Form Body */}
                <View className="gap-8">
                    {/* Hero Image Section */}
                    <Animated.View entering={FadeInUp.duration(600).delay(200)}>
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-4 ml-1">Portada del Artículo</Text>
                        {image ? (
                            <View className="w-full h-56 rounded-[32px] overflow-hidden relative shadow-xl shadow-black/5">
                                <RNImage
                                    source={{ uri: image.uri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <AnimatedPressable
                                    onPress={() => setImage(null)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full items-center justify-center backdrop-blur-md"
                                >
                                    <X size={20} color="#fff" />
                                </AnimatedPressable>
                            </View>
                        ) : (
                            <Pressable
                                onPress={pickImage}
                                className="w-full h-56 rounded-[32px] border-2 border-dashed border-[#e2e8f0] dark:border-[#333] bg-white dark:bg-[#1e1e1e] items-center justify-center"
                            >
                                <View className="w-16 h-16 bg-[#f8fafc] dark:bg-[#121212] rounded-full items-center justify-center mb-4 border border-[#f1f5f9] dark:border-[#2a2a2a]">
                                    <Camera size={28} color="#94a3b8" />
                                </View>
                                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[#64748b] dark:text-[#94a3b8]">Subir imagen de portada</Text>
                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[#94a3b8] text-[10px] mt-1.5 uppercase tracking-normal">JPG, PNG • Máximo 5MB</Text>
                            </Pressable>
                        )}
                    </Animated.View>

                    {/* Input Fields */}
                    <View className="gap-6 mt-2">
                        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
                            <View className="flex-row items-center gap-2 mb-2 ml-1">
                                <Type size={14} color="#64748b" />
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b]">Título Principal</Text>
                            </View>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Ingrese un título impactante..."
                                placeholderTextColor="#94a3b8"
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6]"
                            />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
                            <View className="flex-row items-center gap-2 mb-2 ml-1">
                                <FileText size={14} color="#64748b" />
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b]">Subtítulo / Introducción</Text>
                            </View>
                            <TextInput
                                value={subTitle}
                                onChangeText={setSubTitle}
                                placeholder="Un breve resumen que atrape..."
                                placeholderTextColor="#94a3b8"
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6]"
                            />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(600).delay(500)}>
                            <View className="flex-row items-center gap-2 mb-2 ml-1">
                                <Tag size={14} color="#64748b" />
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b]">Categoría</Text>
                            </View>
                            <TextInput
                                value={category}
                                onChangeText={setCategory}
                                placeholder="Ej: Pensamiento, Tecnología, Vida"
                                placeholderTextColor="#94a3b8"
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6]"
                            />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                            <View className="flex-row items-center gap-2 mb-2 ml-1">
                                <Sparkles size={14} color="#64748b" />
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b]">Cuerpo del Artículo</Text>
                            </View>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={10}
                                textAlignVertical="top"
                                placeholder="Escribe tu historia aquí o usa la IA para empezar..."
                                placeholderTextColor="#94a3b8"
                                style={{ fontFamily: 'Inter_400Regular' }}
                                className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6] min-h-[200px] leading-6"
                            />
                        </Animated.View>
                    </View>

                    {/* Submit Section */}
                    <Animated.View entering={FadeInDown.duration(600).delay(700)} className="mt-8">
                        <AnimatedPressable
                            onPress={handleSubmit}
                            disabled={isCreating}
                            className="w-full bg-black dark:bg-white h-16 rounded-[22px] flex-row items-center justify-center shadow-2xl dark:shadow-none"
                        >
                            {isCreating ? (
                                <ActivityIndicator color={colorScheme === 'dark' ? '#000' : '#fff'} />
                            ) : (
                                <>
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-lg mr-2">Publicar Artículo</Text>
                                    <Sparkles size={20} color={colorScheme === 'dark' ? '#000' : '#fff'} strokeWidth={1.5} />
                                </>
                            )}
                        </AnimatedPressable>
                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-center text-[#94a3b8] text-[10px] mt-4 uppercase tracking-widest">
                            El blog se publicará de inmediato
                        </Text>
                    </Animated.View>
                </View>
            </View>

            {/* SUCCESS MODAL */}
            <Modal
                transparent={true}
                visible={successModalVisible}
                animationType="fade"
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/60 px-8">
                    <View className="bg-white dark:bg-[#121212] w-full max-w-sm rounded-[42px] p-10 shadow-2xl items-center border border-gray-100 dark:border-gray-800">
                        <View className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-full items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-900/20">
                            <CheckCircle size={40} color="#10b981" />
                        </View>

                        <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-3xl text-[#1a1a1a] dark:text-[#f3f4f6] text-center mb-3">
                            ¡Éxito total!
                        </Text>

                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[#64748b] dark:text-[#9ca3af] text-center text-sm leading-6 mb-10 px-4">
                            Tu blog ha sido procesado y ya está volando por la red. ¡Excelente trabajo!
                        </Text>

                        <AnimatedPressable
                            onPress={() => setSuccessModalVisible(false)}
                            className="w-full h-15 rounded-2xl bg-black dark:bg-white items-center justify-center shadow-lg"
                        >
                            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-base">Cerrar y continuar</Text>
                        </AnimatedPressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
