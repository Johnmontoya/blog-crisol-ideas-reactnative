import BlogScreen from '@/app/(tabs)/addblog';
import DashboardScreen from '@/app/(tabs)/dashboard';
import ListBlogScreen from '@/app/(tabs)/listblog';
import ProfileScreen from '@/app/(tabs)/profile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', textTransform: 'none' },
                tabBarStyle: { backgroundColor: '#fff' },
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
                name="Blog"
                component={BlogScreen}
                options={{ title: 'Add Blog' }}
            />
            <Tab.Screen
                name="ListBlog"
                component={ListBlogScreen}
                options={{ title: 'Blog List' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Mi Perfil' }}
            />
        </Tab.Navigator>
    );
}