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

const Tab = createMaterialTopTabNavigator();

export default function MyTabsAdmin() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', textTransform: 'none' },
                tabBarStyle: { backgroundColor: '#fff' },
                tabBarItemStyle: { width: 'auto', minWidth: 100 },
                tabBarIndicatorStyle: { backgroundColor: '#6366f1' },
                tabBarActiveTintColor: '#6366f1',
                tabBarInactiveTintColor: '#64748b',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Inicio' }}
            />
            <Tab.Screen
                name="Users"
                component={UsersScreen}
                options={{ title: 'Usuarios' }}
            />
            <Tab.Screen
                name="AddNews"
                component={AddNewsScreen}
                options={{ title: 'Add News' }}
            />
            <Tab.Screen
                name="NewList"
                component={NewListScreen}
                options={{ title: 'News List' }}
            />
            <Tab.Screen
                name="AddBlog"
                component={AddBlogScreen}
                options={{ title: 'Add Blog' }}
            />
            <Tab.Screen
                name="ListBlog"
                component={ListBlogScreen}
                options={{ title: 'Blog List' }}
            />
            <Tab.Screen
                name="Comment"
                component={CommentScreen}
                options={{ title: 'Comentarios' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Mi Perfil' }}
            />
        </Tab.Navigator>
    );
}