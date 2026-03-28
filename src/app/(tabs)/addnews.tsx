import AnimatedPressable from '@/components/ui/AnimatedPressable';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCreateNewsMutation } from '@/queries/mutation/newsMutation';
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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Haptics from 'expo-haptics';
import { CheckCircle, Image as ImageIcon, List, Newspaper, Quote } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import BulletList from './(newsform)/BulletList';
import HeroImage from './(newsform)/HeroImage';
import QuoteBlock from './(newsform)/QuoteBlock';

const Tab = createMaterialTopTabNavigator();

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

    if (!playfairLoaded || !interLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

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
        <ScrollView className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]">
            <View className="p-6 pb-20 pt-10">
                {/* Header Section */}
                <Animated.View
                    entering={FadeInUp.duration(600).delay(100)}
                    className="mb-10"
                >
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                        className="text-5xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tighter"
                    >
                        Agregar Noticia.
                    </Text>
                    <Text
                        style={{ fontFamily: 'Inter_400Regular' }}
                        className="text-lg text-[#666] dark:text-[#999] mt-2"
                    >
                        Publica contenido dinámico en tu feed principal.
                    </Text>
                    <View className="h-[1px] bg-[#d1d1d1] dark:bg-[#333] w-full mt-6" />
                </Animated.View>

                {/* Form Fields */}
                <View className="gap-8">
                    <Animated.View entering={FadeInDown.duration(600).delay(300)}>
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Título de la Noticia</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ingrese el título..."
                            placeholderTextColor="#94a3b8"
                            style={{ fontFamily: 'Inter_400Regular' }}
                            className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6] text-base"
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.duration(600).delay(400)}>
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] tracking-widest uppercase text-[#64748b] mb-2 ml-1">Categoría</Text>
                        <TextInput
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Ej. Tecnología, Política, Deportes"
                            placeholderTextColor="#94a3b8"
                            style={{ fontFamily: 'Inter_400Regular' }}
                            className="bg-white dark:bg-[#1e1e1e] p-5 rounded-lg border border-gray-100 dark:border-gray-800 text-[#1a1a1a] dark:text-[#f3f4f6] text-base"
                        />
                    </Animated.View>

                    {/* News Type Selector replaced by Tab Navigator Label */}
                    <Animated.View
                        entering={FadeInUp.duration(600).delay(200)}
                        className="mb-4"
                    >
                        <Text
                            style={{ fontFamily: 'Inter_700Bold' }}
                            className="text-[10px] tracking-widest uppercase text-[#64748b] ml-1"
                        >
                            Seleccione Plantilla
                        </Text>
                    </Animated.View>

                    <View className="pt-8 border-t border-gray-100 dark:border-gray-800" style={{ height: 450 }}>
                        <Tab.Navigator
                            screenOptions={{
                                tabBarLabelStyle: { fontSize: 10, fontFamily: 'Inter_700Bold', textTransform: 'uppercase' },
                                tabBarStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
                                tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                                tabBarInactiveTintColor: '#94a3b8',
                                tabBarIndicatorStyle: { backgroundColor: '#d97706', height: 3, borderRadius: 3 },
                            }}
                            screenListeners={{
                                state: (e: any) => {
                                    const index = e.data.state.index;
                                    const routeName = e.data.state.routeNames[index];
                                    if (routeName === 'Imagen') setType('hero-image');
                                    if (routeName === 'Cita') setType('quote-block');
                                    if (routeName === 'Lista') setType('bullet-list');
                                },
                            }}
                        >
                            <Tab.Screen name="Imagen">
                                {() => (
                                    <HeroImage
                                        imageUrl={imageUrl}
                                        setImageUrl={setImageUrl}
                                        description={description}
                                        setDescription={setDescription}
                                        colorScheme={colorScheme}
                                    />
                                )}
                            </Tab.Screen>
                            <Tab.Screen name="Cita">
                                {() => (
                                    <QuoteBlock
                                        quoteText={quoteText}
                                        setQuoteText={setQuoteText}
                                        context={context}
                                        setContext={setContext}
                                        colorScheme={colorScheme}
                                    />
                                )}
                            </Tab.Screen>
                            <Tab.Screen name="Lista">
                                {() => (
                                    <BulletList
                                        points={points}
                                        setPoints={setPoints}
                                        author={author}
                                        setAuthor={setAuthor}
                                        colorScheme={colorScheme}
                                    />
                                )}
                            </Tab.Screen>
                        </Tab.Navigator>
                    </View>
                </View>

                {/* Submit button using AnimatedPressable */}
                <Animated.View entering={FadeInDown.duration(600).delay(600)} className="mt-12">
                    <AnimatedPressable
                        onPress={handleSubmit}
                        disabled={isPending}
                        className="w-full bg-black dark:bg-white h-16 rounded-xl flex-row items-center justify-center shadow-xl dark:shadow-none"
                    >
                        {isPending ? (
                            <ActivityIndicator color={colorScheme === 'dark' ? '#000' : '#fff'} />
                        ) : (
                            <>
                                <Text
                                    style={{ fontFamily: 'Inter_700Bold' }}
                                    className="text-white dark:text-black text-lg mr-2"
                                >
                                    Confirmar Noticia
                                </Text>
                                <Newspaper size={20} color={colorScheme === 'dark' ? '#000' : '#fff'} strokeWidth={1.5} />
                            </>
                        )}
                    </AnimatedPressable>
                </Animated.View>
            </View>

            {/* SUCCESS MODAL (Consistent with Admin Logic) */}
            <Modal
                transparent={true}
                visible={successModalVisible}
                animationType="fade"
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40 px-8">
                    <View className="bg-white dark:bg-[#121212] w-full rounded-2xl p-10 shadow-2xl items-center border border-gray-100 dark:border-gray-800">
                        <View className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/10 rounded-full items-center justify-center mb-6">
                            <CheckCircle size={32} color="#10b981" />
                        </View>

                        <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-3xl text-[#1a1a1a] dark:text-[#f3f4f6] text-center mb-2">
                            Noticia publicada.
                        </Text>

                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[#64748b] text-center text-sm leading-6 mb-10 px-4">
                            Todo listo. El contenido ya está disponible para el público.
                        </Text>

                        <AnimatedPressable
                            onPress={() => setSuccessModalVisible(false)}
                            className="w-full h-14 rounded-xl bg-black dark:bg-white items-center justify-center"
                        >
                            <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black text-base">Cerrar</Text>
                        </AnimatedPressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}