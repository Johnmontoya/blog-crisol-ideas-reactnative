import HomeNavbar from '@/components/HomeNavbar';
import AnimatedPressable from '@/components/ui/AnimatedPressable';
import { urlServer } from '@/config/config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetBlogQueries } from '@/queries/query/blog.query';
import { useGetNewsQueries } from '@/queries/query/news.query';
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
    PlayfairDisplay_800ExtraBold,
    useFonts as usePlayfairFonts
} from '@expo-google-fonts/playfair-display';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, ChevronRight, LayoutGrid, Plane, Smartphone, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Text,
    View,
    Pressable,
    Image as RNImage
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import routerMeta from '../../types/routerMeta';

const { width } = Dimensions.get('window');

const HomePage = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const navigation = useNavigation<any>();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const isDark = colorScheme === 'dark';

    const [playfairLoaded] = usePlayfairFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
        PlayfairDisplay_800ExtraBold,
    });

    const [interLoaded] = useInterFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const blogQueries = useGetBlogQueries();
    const blogData = blogQueries[0].data as any;
    const blogPosts = blogData?.blogs || (Array.isArray(blogData) ? blogData : []);
    const isLoadingBlogs = blogQueries[0].isLoading;

    const newsQueries = useGetNewsQueries();
    const newsData = newsQueries[0].data as any;
    const newsList = newsData?.news || (Array.isArray(newsData) ? newsData : []);
    const isLoadingNews = newsQueries[0].isLoading;

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return undefined;
        let normalizedPath = String(imagePath).replace(/\\/g, '/');
        if (normalizedPath.startsWith('http')) return normalizedPath;
        if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;
        return `${urlServer}${normalizedPath}`;
    };

    if (!playfairLoaded || !interLoaded || isLoadingBlogs || isLoadingNews) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#d97706" />
            </View>
        );
    }

    const categories = [
        { id: 'all', name: 'TODO', icon: <LayoutGrid size={14} color="#666" /> },
        { id: 'tech', name: 'TECNOLOGÍA', icon: <Smartphone size={14} color="#666" /> },
        { id: 'travel', name: 'VIAJES', icon: <Plane size={14} color="#666" /> },
        { id: 'sport', name: 'SPORT', icon: <TrendingUp size={14} color="#666" /> },
    ];

    /* Static mockup data for latest news removed or kept as is if not part of the query */

    /* Static mockup data for latest news removed */

    return (
        <View className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]">
            <HomeNavbar />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* HERO HEADER */}
                <Animated.View
                    entering={FadeInUp.duration(1000)}
                    className="pt-10 pb-12 items-center px-6"
                >
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_800ExtraBold' }}
                        className="text-7xl text-[#1a1a1a] dark:text-[#f3f4f6] text-center tracking-tighter"
                    >
                        El Arte de
                    </Text>
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                        className="text-7xl text-[#d97706] dark:text-[#f59e0b] text-center -mt-2 tracking-tighter italic"
                    >
                        Reflexión.
                    </Text>

                    <View className="w-full max-w-[280px] mt-6">
                        <Text
                            style={{ fontFamily: 'Inter_400Regular' }}
                            className="text-xs text-[#666] dark:text-[#999] text-center leading-5 uppercase tracking-widest"
                        >
                            Narrativas seleccionadas sobre el crecimiento. Un santuario para la mente moderna.
                        </Text>
                    </View>

                    <View className="w-[1px] h-20 bg-[#d1d1d1] dark:bg-[#333] mt-10" />
                </Animated.View>

                {/* CATEGORIES BAR */}
                <View className="py-8 border-y border-[#eee] dark:border-[#222]">
                    <Text
                        style={{ fontFamily: 'Inter_700Bold' }}
                        className="text-[10px] tracking-[3px] text-[#999] mb-4 px-6 uppercase"
                    >
                        — THE INDEX
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {categories.map((cat, index) => (
                            <AnimatedPressable
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                style={[
                                    selectedCategory === cat.id && { borderColor: '#d97706', backgroundColor: isDark ? '#2d2112' : '#fffbeb' }
                                ]}
                                className="flex-row items-center bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-lg mr-3"
                            >
                                {React.cloneElement(cat.icon as React.ReactElement<any>, { color: selectedCategory === cat.id ? '#d97706' : '#666' })}
                                <Text
                                    style={{ fontFamily: 'Inter_600SemiBold' }}
                                    className={`text-[10px] ml-2 tracking-wider ${selectedCategory === cat.id ? 'text-[#d97706]' : 'text-[#666] dark:text-[#999]'}`}
                                >
                                    {cat.name}
                                </Text>
                            </AnimatedPressable>
                        ))}
                    </ScrollView>
                </View>

                {/* MAIN FEED SECTION */}
                <View className="p-6">
                    <View className="flex-row flex-wrap justify-between">
                        {/* LEFT COLUMN: BLOG POSTS */}
                        <View className="w-[48%] gap-8">
                            {blogPosts
                                .filter((post: any) => selectedCategory === 'all' || post.category.toUpperCase() === selectedCategory.toUpperCase())
                                .filter((_: any, i: number) => i % 2 === 0)
                                .map((post: any, index: number) => (
                                    <Pressable
                                        key={post._id}
                                        onPress={() => navigation.navigate(routerMeta.BlogPage.name, { post: post })}
                                        className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]"
                                    >
                                        <View className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <RNImage
                                                source={{ uri: getImageUrl(post.image) }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                            <View className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded">
                                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[8px] text-white tracking-widest uppercase">
                                                    {post.category}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="p-4">
                                            <View className="flex-row justify-between mb-2">
                                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[8px] text-[#d97706] uppercase tracking-widest">BY {post.author.username}</Text>
                                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[8px] text-[#999]">{new Date(post.createdAt).toLocaleDateString()}</Text>
                                            </View>
                                            <Text
                                                style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                                                className="text-lg text-[#1a1a1a] dark:text-[#f3f4f6] mb-2 leading-6"
                                                numberOfLines={2}
                                            >
                                                {post.title}
                                            </Text>
                                            <Text
                                                style={{ fontFamily: 'Inter_400Regular' }}
                                                className="text-[10px] text-[#666] dark:text-[#999] leading-4 mb-4"
                                                numberOfLines={3}
                                            >
                                                {post.subTitle}
                                            </Text>
                                            <View className="flex-row items-center border-t border-gray-50 dark:border-gray-800 pt-3">
                                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[9px] text-[#1a1a1a] dark:text-[#f3f4f6] uppercase tracking-[2px]">Read Article</Text>
                                                <ChevronRight size={10} color="#666" className="ml-1" />
                                            </View>
                                        </View>
                                    </Pressable>
                                ))}
                        </View>

                        {/* RIGHT COLUMN: BLOG POSTS */}
                        <View className="w-[48%] gap-8">
                            {blogPosts
                                .filter((post: any) => selectedCategory === 'all' || post.category.toUpperCase() === selectedCategory.toUpperCase())
                                .filter((_: any, i: number) => i % 2 !== 0)
                                .map((post: any, index: number) => (
                                    <Pressable
                                        key={post._id}
                                        onPress={() => navigation.navigate(routerMeta.BlogPage.name, { post: post })}
                                        className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]"
                                    >
                                        <View className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <RNImage
                                                source={{ uri: getImageUrl(post.image) }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                            <View className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded">
                                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[8px] text-white tracking-widest uppercase">
                                                    {post.category}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="p-4">
                                            <View className="flex-row justify-between mb-2">
                                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[8px] text-[#d97706] uppercase tracking-widest">BY {post.author.username}</Text>
                                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[8px] text-[#999]">{new Date(post.createdAt).toLocaleDateString()}</Text>
                                            </View>
                                            <Text
                                                style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                                                className="text-lg text-[#1a1a1a] dark:text-[#f3f4f6] mb-2 leading-6"
                                                numberOfLines={2}
                                            >
                                                {post.title}
                                            </Text>
                                            <Text
                                                style={{ fontFamily: 'Inter_400Regular' }}
                                                className="text-[10px] text-[#666] dark:text-[#999] leading-4 mb-4"
                                                numberOfLines={3}
                                            >
                                                {post.subTitle}
                                            </Text>
                                            <View className="flex-row items-center border-t border-gray-50 dark:border-gray-800 pt-3">
                                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[9px] text-[#1a1a1a] dark:text-[#f3f4f6] uppercase tracking-[2px]">Read Article</Text>
                                                <ChevronRight size={10} color="#666" className="ml-1" />
                                            </View>
                                        </View>
                                    </Pressable>
                                ))}
                        </View>
                    </View>

                    {/* SIDEBAR LATEST NEWS SECTION (STRETCHED ON MOBILE) */}
                    <View className="mt-16 pt-12 border-t border-[#eee] dark:border-[#222]">
                        <Text
                            style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                            className="text-3xl text-[#1a1a1a] dark:text-[#f3f4f6] mb-8 italic"
                        >
                            Últimas Noticias
                        </Text>

                        {newsList.map((news: any) => (
                            <View key={news._id} className="mb-10">
                                <View className="w-full aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden mb-6 shadow-2xl">
                                    <RNImage
                                        source={{ uri: getImageUrl(news.image) }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-[#d97706] uppercase tracking-[3px] mb-3">{news.category}</Text>
                                <Text
                                    style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                                    className="text-2xl text-[#1a1a1a] dark:text-[#f3f4f6] mb-4 leading-8"
                                >
                                    {news.title}
                                </Text>
                                <Text
                                    style={{ fontFamily: 'Inter_400Regular' }}
                                    className="text-sm text-[#666] dark:text-[#999] leading-6 mb-6"
                                >
                                    {news.subTitle}
                                </Text>
                                <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[10px] text-[#999] uppercase">{new Date(news.createdAt).toLocaleDateString()}</Text>
                                <View className="h-[1px] bg-[#eee] dark:bg-[#222] w-full mt-10" />
                            </View>
                        ))}

                        {/* TRENDS LIST */}
                        <View className="mt-4 gap-6">
                            <View>
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[9px] text-[#d97706] uppercase tracking-widest mb-3">TECNOLOGÍA</Text>
                                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-xl text-[#1a1a1a] dark:text-[#f3f4f6] leading-7">3 Tendencias Clave en Desarrollo Web para 2024</Text>
                                <View className="mt-4 gap-2">
                                    <View className="flex-row items-center gap-2">
                                        <CheckCircle2 size={12} color="#6366f1" />
                                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-[#666] dark:text-[#999]">IA en interfaces de usuario</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <CheckCircle2 size={12} color="#6366f1" />
                                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-[#666] dark:text-[#999]">Más énfasis en WebAssembly</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <CheckCircle2 size={12} color="#6366f1" />
                                        <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[11px] text-[#666] dark:text-[#999]">Rise of Full-Stack Serverless</Text>
                                    </View>
                                </View>
                            </View>

                            {/* OPINION QUOTE */}
                            <View className="mt-4 p-8 border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-[#1a1b26] rounded-3xl">
                                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[9px] text-indigo-400 uppercase tracking-widest mb-4">OPINIÓN</Text>
                                <Text
                                    style={{ fontFamily: 'PlayfairDisplay_400Regular' }}
                                    className="text-lg text-[#334155] dark:text-[#a9b1d6] leading-7 italic"
                                >
                                    "La sostenibilidad no es una opción, es la única estrategia de negocio viable a largo plazo."
                                </Text>
                                <View className="mt-6 flex-row items-center">
                                    <View className="w-6 h-[1px] bg-indigo-200 mr-3" />
                                    <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[10px] text-indigo-500">Tip del Día: Técnica Pomodoro</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* CALL TO ACTION */}
                <Animated.View
                    entering={FadeInDown.delay(1000)}
                    className="mx-6 mb-20 bg-black dark:bg-white p-10 rounded-[40px] items-center shadow-2xl"
                >
                    <Text
                        style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                        className="text-3xl text-white dark:text-black text-center"
                    >
                        Únete a la conversación.
                    </Text>
                    <Text
                        style={{ fontFamily: 'Inter_400Regular' }}
                        className="text-sm text-gray-400 dark:text-gray-500 text-center mt-4 mb-8 leading-6"
                    >
                        Más de 50.000 lectores reciben nuestras historias semanalmente.
                    </Text>

                    <AnimatedPressable
                        className="w-full h-16 rounded-2xl bg-[#d97706] items-center justify-center shadow-lg"
                        onPress={() => navigation.navigate(routerMeta.LoginPage.name)}
                    >
                        <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white text-base uppercase tracking-[2px]">Suscribirse</Text>
                    </AnimatedPressable>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

export default HomePage;
