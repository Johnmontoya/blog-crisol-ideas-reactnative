import { urlServer } from '@/config/config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts as useInterFonts
} from '@expo-google-fonts/inter';
import {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    useFonts as usePlayfairFonts
} from '@expo-google-fonts/playfair-display';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Share2 } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    Image as RNImage,
    ScrollView,
    Share,
    Text,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const getImageUrl = (imagePath: string) => {
    if (!imagePath) return undefined;
    let normalizedPath = String(imagePath).replace(/\\/g, '/');
    if (normalizedPath.startsWith('http')) return normalizedPath;
    if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;
    return `${urlServer}${normalizedPath}`;
};

export default function BlogPage() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';

    // Recuperamos los datos pasados desde el HomePage
    const post = route.params?.post;

    const [webViewHeight, setWebViewHeight] = React.useState(100);

    const [playfairLoaded] = usePlayfairFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_700Bold,
    });

    const [interLoaded] = useInterFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    if (!playfairLoaded || !interLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="large" color="#d97706" />
            </View>
        );
    }

    if (!post) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-[#64748b]">Artículo no encontrado.</Text>
                <Pressable onPress={() => navigation.goBack()} className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <Text style={{ fontFamily: 'Inter_700Bold' }}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
            <style>
                body {
                    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu;
                    font-size: 17px;
                    color: ${isDark ? '#a3a3a3' : '#444'};
                    line-height: 1.6;
                    padding: 0;
                    margin: 0;
                    background-color: transparent;
                }
                a { color: #d97706; text-decoration: none; font-weight: 500; }
                img, iframe, video { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
                h1, h2, h3, h4 { color: ${isDark ? '#f3f4f6' : '#1a1a1a'}; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu; font-weight: bold; margin-top: 24px; margin-bottom: 12px; }
                p { margin-bottom: 16px; }
                ul, ol { padding-left: 20px; margin-bottom: 16px; }
                li { margin-bottom: 8px; }
                blockquote { border-left: 4px solid #d97706; padding-left: 16px; margin: 16px 0; font-style: italic; color: ${isDark ? '#888' : '#666'}; }
            </style>
        </head>
        <body>
            ${post.description}
            <script>
                function sendHeight() {
                    var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                    window.ReactNativeWebView.postMessage(height.toString());
                }
                setTimeout(sendHeight, 100);
                setTimeout(sendHeight, 500);
                setTimeout(sendHeight, 1000);
                window.addEventListener('resize', sendHeight);
                document.addEventListener("DOMContentLoaded", sendHeight);
            </script>
        </body>
        </html>
    `;
    const onShare = async () => {
        try {
            await Share.share({
                message: `${post.title} - Lee más en Crisol Ideas`,
                url: `https://crisolideas.com/blog/${post.slug || post.id}`,
                title: post.title,
            });
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <View className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]">
            {/* FLOATING HEADER */}
            <View className="absolute top-12 left-0 right-0 z-50 flex-row justify-between px-6">
                <Pressable
                    onPress={onShare}
                    className="w-12 h-12 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full items-center justify-center shadow-sm"
                >
                    <Share2 size={24} color={isDark ? '#fff' : '#000'} strokeWidth={1.5} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* HERO IMAGE SECTION */}
                <Animated.View entering={FadeInUp.duration(800)} className="w-full relative shadow-sm" style={{ height: height * 0.5 }}>
                    <RNImage
                        source={{ uri: getImageUrl(post.image) }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/30" />
                </Animated.View>

                {/* CONTENT SECTION */}
                <View className="bg-[#fdfdfc] dark:bg-[#121212] -mt-12 rounded-t-[40px] px-8 pt-10 pb-24">
                    <Animated.View entering={FadeInDown.duration(800).delay(200)}>
                        <View className="flex-row items-center mb-6">
                            <View className="bg-[#d97706] px-4 py-1.5 rounded-full">
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[10px] text-white tracking-[2px] uppercase">
                                    {post.category}
                                </Text>
                            </View>
                            <View className="w-1.5 h-1.5 rounded-full bg-[#d1d1d1] mx-4" />
                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-[#666] dark:text-[#999] uppercase tracking-wider">
                                {new Date(post.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Text>
                        </View>

                        <Text
                            style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                            className="text-4xl md:text-5xl text-[#1a1a1a] dark:text-[#f3f4f6] leading-[48px] tracking-tight mb-6"
                        >
                            {post.title}
                        </Text>

                        {/* AUTHOR META */}
                        <View className="flex-row items-center justify-between py-6 border-y border-[#eee] dark:border-[#222] mb-10">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4 border border-gray-200">
                                    <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-lg text-gray-500">
                                        {post.author?.username?.charAt(0).toUpperCase() || 'A'}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[10px] text-[#999] uppercase tracking-widest mb-1">Escrito por</Text>
                                    <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-[#1a1a1a] dark:text-[#f3f4f6] text-base">{post.author?.username || 'Redacción'}</Text>
                                </View>
                            </View>
                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[#d97706] text-xs">Lectura de 5 min</Text>
                        </View>

                        {/* SUBTITLE */}
                        <Text
                            style={{ fontFamily: 'PlayfairDisplay_400Regular' }}
                            className="text-2xl text-[#333] dark:text-[#d1d1d1] leading-9 italic mb-10"
                        >
                            {post.subTitle}
                        </Text>

                        {/* MAIN CONTENT TEXT */}
                        <WebView
                            source={{ html: htmlContent }}
                            style={{ height: webViewHeight, width: width - 64, backgroundColor: 'transparent' }}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            onMessage={(event) => {
                                if (event.nativeEvent.data) {
                                    const newHeight = Number(event.nativeEvent.data);
                                    if (newHeight > 0 && newHeight !== webViewHeight) {
                                        setWebViewHeight(newHeight);
                                    }
                                }
                            }}
                            containerStyle={{ marginBottom: 24 }}
                        />

                        <View className="h-[1px] w-1/3 bg-[#d1d1d1] dark:bg-[#333] mb-12 self-center mt-6" />

                        {/* END OF ARTICLE CTA */}
                        <View className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl items-center border border-amber-100 dark:border-amber-900/30">
                            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold' }} className="text-2xl text-[#1a1a1a] dark:text-[#f3f4f6] mb-3">
                                ¿Te gustó esta lectura?
                            </Text>
                            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-center text-[#666] dark:text-[#999] mb-6 leading-6">
                                Únete a nuestra newsletter para recibir las últimas historias y reflexiones directamente en tu bandeja.
                            </Text>
                            <Pressable
                                className="w-full bg-black dark:bg-white h-14 rounded-full items-center justify-center shadow-lg"
                                onPress={() => navigation.navigate('RegisterPage')}
                            >
                                <Text style={{ fontFamily: 'Inter_700Bold' }} className="text-white dark:text-black uppercase tracking-[2px] text-xs">
                                    Suscribirme Gratis
                                </Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}