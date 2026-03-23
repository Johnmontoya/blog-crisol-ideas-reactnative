import AddBlogScreen from '@/app/(tabs)/addblog';
import AddNewsScreen from '@/app/(tabs)/addnews';
import CommentScreen from '@/app/(tabs)/comment';
import DashboardScreen from '@/app/(tabs)/dashboard';
import ListBlogScreen from '@/app/(tabs)/listblog';
import NewListScreen from '@/app/(tabs)/newlist';
import ProfileScreen from '@/app/(tabs)/profile';
import UsersScreen from '@/app/(tabs)/users';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Platform } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function MyTabsAdmin() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: '700',
                    textTransform: 'none',
                    letterSpacing: 0.2
                },
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 4,
                        },
                    }),
                },
                tabBarItemStyle: { width: 'auto', minWidth: 100 },
                tabBarIndicatorStyle: {
                    backgroundColor: '#6366f1',
                    height: 3,
                    borderRadius: 3,
                    marginBottom: -1,
                },
                tabBarActiveTintColor: '#6366f1',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarPressColor: 'rgba(99, 102, 241, 0.1)',
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Inicio' }} />
            <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'Usuarios' }} />
            <Tab.Screen name="AddNews" component={AddNewsScreen} options={{ title: 'Add News' }} />
            <Tab.Screen name="NewList" component={NewListScreen} options={{ title: 'News List' }} />
            <Tab.Screen name="AddBlog" component={AddBlogScreen} options={{ title: 'Add Blog' }} />
            <Tab.Screen name="ListBlog" component={ListBlogScreen} options={{ title: 'Blog List' }} />
            <Tab.Screen name="Comment" component={CommentScreen} options={{ title: 'Comentarios' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi Perfil' }} />
        </Tab.Navigator>
    );
}