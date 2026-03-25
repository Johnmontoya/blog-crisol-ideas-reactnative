import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNavigation } from '@react-navigation/native';
import { User } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import routerMeta from '../types/routerMeta';
import AnimatedPressable from './ui/AnimatedPressable';

const HomeNavbar = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const navigation = useNavigation<any>();

    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView edges={['top']} style={[
            styles.safeArea,
            { backgroundColor: isDark ? '#121212' : '#fdfdfc' }
        ]}>
            <Animated.View
                entering={FadeIn.duration(800)}
                style={styles.container}
            >
                {/* Center: Brand/Logo */}
                <View style={styles.brandContainer}>
                    <Text
                        style={[
                            styles.brandText,
                            { color: isDark ? '#f3f4f6' : '#1a1a1a', fontFamily: 'PlayfairDisplay_800ExtraBold' }
                        ]}
                    >
                        CRISOL DE IDEAS
                    </Text>
                    <View style={styles.dot} />
                </View>

                {/* Right: Search & Profile */}
                <View style={styles.rightSection}>
                    <AnimatedPressable
                        style={styles.iconButton}
                        onPress={() => navigation.navigate(routerMeta.LoginPage.name)}
                    >
                        <User
                            size={22}
                            strokeWidth={1.5}
                            color={isDark ? '#f3f4f6' : '#1a1a1a'}
                        />
                    </AnimatedPressable>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    brandText: {
        fontSize: 20,
        letterSpacing: 2,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#d97706',
        marginLeft: 2,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeNavbar;
