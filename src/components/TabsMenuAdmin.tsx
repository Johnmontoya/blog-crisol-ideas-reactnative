import AddBlogScreen from '@/app/(tabs)/addblog';
import AddNewsScreen from '@/app/(tabs)/addnews';
import CommentScreen from '@/app/(tabs)/comment';
import DashboardScreen from '@/app/(tabs)/dashboard';
import ListBlogScreen from '@/app/(tabs)/listblog';
import NewListScreen from '@/app/(tabs)/newlist';
import ProfileScreen from '@/app/(tabs)/profile';
import UsersScreen from '@/app/(tabs)/users';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts as useInterFonts
} from '@expo-google-fonts/inter';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function MyTabsAdmin() {
    const colorScheme = useColorScheme() ?? 'light';
    const isDark = colorScheme === 'dark';

    const [interLoaded] = useInterFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    if (!interLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-[#fdfdfc] dark:bg-[#121212]">
                <ActivityIndicator size="small" color="#d97706" />
            </View>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Inter_700Bold',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                },
                tabBarStyle: {
                    backgroundColor: '#fdfdfc',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,0.05)',
                },
                tabBarItemStyle: { width: 'auto', minWidth: 100, paddingVertical: 8 },
                tabBarIndicatorStyle: {
                    backgroundColor: '#d97706',
                    height: 2,
                    borderRadius: 2,
                },
                tabBarActiveTintColor: '#d97706',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarPressColor: 'rgba(217, 119, 6, 0.05)',
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'Usuarios' }} />
            <Tab.Screen name="AddNews" component={AddNewsScreen} options={{ title: 'Crear Noticia' }} />
            <Tab.Screen name="NewList" component={NewListScreen} options={{ title: 'Noticias' }} />
            <Tab.Screen name="AddBlog" component={AddBlogScreen} options={{ title: 'Escribir' }} />
            <Tab.Screen name="ListBlog" component={ListBlogScreen} options={{ title: 'Publicaciones' }} />
            <Tab.Screen name="Comment" component={CommentScreen} options={{ title: 'Comentarios' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}