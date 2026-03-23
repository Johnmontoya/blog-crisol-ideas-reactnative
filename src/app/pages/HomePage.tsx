import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import routerMeta from '../../types/routerMeta';
import AnimatedPressable from '../../components/ui/AnimatedPressable';

const { width } = Dimensions.get('window');

const HomePage = () => {
    const navigation = useNavigation<any>();

    const categories = [
        { id: 1, name: 'Tecnología', icon: '💻' },
        { id: 2, name: 'Ciencia', icon: '🔬' },
        { id: 3, name: 'Cultura', icon: '🎨' },
        { id: 4, name: 'Viajes', icon: '🌍' },
    ];

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View className="h-[450px] w-full relative">
                    <Image
                        source="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                        className="flex-1"
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute left-0 right-0 bottom-0 h-3/5"
                    />
                    <View className="absolute bottom-10 left-5 right-5">
                        <Animated.Text 
                            entering={FadeInUp.delay(200).duration(800)}
                            className="text-[42px] font-[900] text-white tracking-tighter"
                        >
                            Crisol de Ideas
                        </Animated.Text>
                        <Animated.Text 
                            entering={FadeInUp.delay(400).duration(800)}
                            className="text-lg text-white/90 mt-2.5 leading-6"
                        >
                            Explora pensamientos, historias y conocimiento en un solo lugar.
                        </Animated.Text>
                    </View>
                </View>

                {/* Content */}
                <SafeAreaView className="px-5 mt-5">
                    <Animated.View 
                        entering={FadeInDown.delay(600).duration(800)}
                        className="flex-row justify-between items-center mb-5"
                    >
                        <Text className="text-[22px] font-bold text-slate-800">Categorías</Text>
                        <AnimatedPressable scaleTo={0.9}>
                            <Text className="text-indigo-500 font-semibold">Ver todas</Text>
                        </AnimatedPressable>
                    </Animated.View>

                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {categories.map((cat, index) => (
                            <Animated.View 
                                key={cat.id}
                                entering={FadeInDown.delay(700 + index * 100).duration(600)}
                            >
                                <AnimatedPressable 
                                    className="bg-white p-5 rounded-[20px] mr-4 items-center w-30 shadow-sm shadow-black" 
                                    scaleTo={0.92}
                                >
                                    <Text className="text-[32px] mb-2.5">{cat.icon}</Text>
                                    <Text className="text-sm font-semibold text-slate-500">{cat.name}</Text>
                                </AnimatedPressable>
                            </Animated.View>
                        ))}
                    </ScrollView>

                    <Animated.View 
                        entering={FadeInDown.delay(1000).duration(800)}
                        className="mt-10 bg-white p-7 rounded-[30px] items-center shadow-md shadow-black/5"
                    >
                        <Text className="text-2xl font-extrabold text-slate-800">¿Listo para unirte?</Text>
                        <Text className="text-base text-slate-500 text-center mt-2.5 mb-6 leading-6">
                            Crea tu cuenta hoy y comienza a compartir tus propias ideas con el mundo.
                        </Text>
                        
                        <AnimatedPressable 
                            className="w-full h-14 rounded-2xl overflow-hidden"
                            scaleTo={0.96}
                            onPress={() => navigation.navigate(routerMeta.LoginPage.name)}
                        >
                            <LinearGradient
                                colors={['#6366f1', '#a855f7']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="flex-1 justify-center items-center"
                            >
                                <Text className="text-white text-lg font-bold">Comenzar Ahora</Text>
                            </LinearGradient>
                        </AnimatedPressable>
                    </Animated.View>
                </SafeAreaView>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

export default HomePage;
