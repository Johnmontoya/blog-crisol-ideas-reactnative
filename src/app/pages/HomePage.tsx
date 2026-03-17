import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import routerMeta from '../../types/routerMeta';

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
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradient}
                    />
                    <View style={styles.heroTextContainer}>
                        <Animated.Text 
                            entering={FadeInUp.delay(200).duration(800)}
                            style={styles.heroTitle}
                        >
                            Crisol de Ideas
                        </Animated.Text>
                        <Animated.Text 
                            entering={FadeInUp.delay(400).duration(800)}
                            style={styles.heroSubtitle}
                        >
                            Explora pensamientos, historias y conocimiento en un solo lugar.
                        </Animated.Text>
                    </View>
                </View>

                {/* Content */}
                <SafeAreaView style={styles.content}>
                    <Animated.View 
                        entering={FadeInDown.delay(600).duration(800)}
                        style={styles.sectionHeader}
                    >
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Ver todas</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                    >
                        {categories.map((cat, index) => (
                            <Animated.View 
                                key={cat.id}
                                entering={FadeInDown.delay(700 + index * 100).duration(600)}
                            >
                                <TouchableOpacity style={styles.categoryCard}>
                                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </ScrollView>

                    <Animated.View 
                        entering={FadeInDown.delay(1000).duration(800)}
                        style={styles.ctaContainer}
                    >
                        <Text style={styles.ctaTitle}>¿Listo para unirte?</Text>
                        <Text style={styles.ctaText}>
                            Crea tu cuenta hoy y comienza a compartir tus propias ideas con el mundo.
                        </Text>
                        
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => navigation.navigate(routerMeta.LoginPage.name)}
                        >
                            <LinearGradient
                                colors={['#6366f1', '#a855f7']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Comenzar Ahora</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </SafeAreaView>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    heroContainer: {
        height: 450,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    heroTextContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    heroTitle: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 10,
        lineHeight: 26,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e293b',
    },
    seeAll: {
        color: '#6366f1',
        fontWeight: '600',
    },
    categoriesList: {
        paddingRight: 20,
    },
    categoryCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        marginRight: 15,
        alignItems: 'center',
        width: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    ctaContainer: {
        marginTop: 40,
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 10,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1e293b',
    },
    ctaText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 25,
        lineHeight: 24,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default HomePage;
