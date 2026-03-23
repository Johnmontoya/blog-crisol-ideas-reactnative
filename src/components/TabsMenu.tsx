import BlogScreen from '@/app/(tabs)/addblog';
import DashboardScreen from '@/app/(tabs)/dashboard';
import ListBlogScreen from '@/app/(tabs)/listblog';
import ProfileScreen from '@/app/(tabs)/profile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Platform } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
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