import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetDashboardQueries } from '@/queries/query/blog.query';
import { useGetUserIdQueries } from '@/queries/query/user.query';
import { useAuthStore } from '@/store/auth';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts as useInterFonts
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfairFonts
} from '@expo-google-fonts/playfair-display';
import { FileText, MessageSquareWarning, Trash, User } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function DashboardScreen() {
  const { userId } = useAuthStore();
  const data = useGetUserIdQueries(userId);
  const colorScheme = useColorScheme() ?? 'light';
  const user = data[0].data?.user;
  const [stats] = useGetDashboardQueries();
  const dashboardData = stats?.data?.Blogs;

  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!playfairLoaded || !interLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdfdfc' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const metrics = [
    {
      id: '01',
      icon: <FileText size={42} strokeWidth={1} color="#666" />,
      label: 'PUBLISHED DISPATCHES',
      value: dashboardData?.blogs || 0,
    },
    {
      id: '02',
      icon: <MessageSquareWarning size={42} strokeWidth={1} color="#666" />,
      label: 'PUBLIC COMMENTS',
      value: dashboardData?.comments || 0,
    },
    {
      id: '03',
      icon: <Trash size={42} strokeWidth={1} color="#666" />,
      label: 'UNPUBLISHED DRAFTS',
      value: dashboardData?.drafts || 0,
    },
    {
      id: '04',
      icon: <User size={42} strokeWidth={1} color="#666" />,
      label: 'REGISTERED USERS',
      value: dashboardData?.users || 0,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-[#fdfdfc] dark:bg-[#121212]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 60 }}
    >
      {/* Header Section */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(100)}
        className="mb-8"
      >
        <Text
          style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
          className="text-6xl text-[#1a1a1a] dark:text-[#f3f4f6] tracking-tighter"
        >
          Metrics.
        </Text>
        <Text
          style={{ fontFamily: 'Inter_400Regular' }}
          className="text-lg text-[#666] dark:text-[#999] mt-2"
        >
          System oversight and quantitative reporting.
        </Text>
        <View className="h-[1px] bg-[#d1d1d1] dark:bg-[#333] w-full mt-6" />
      </Animated.View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap justify-between gap-8">
        {metrics.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.duration(600).delay(200 + index * 100)}
            className="w-[48.5%] border border-gray-200! aspect-square p-4 bg-white dark:bg-[#1e1e1e] mb-[3%] relative justify-between"
          >
            {/* Top Row: Icon and ID */}
            <View className="flex-row justify-between items-start opacity-60">
              <View className="bg-[#f0f0f0] dark:bg-[#2a2a2a] p-2 rounded-sm">
                {item.icon}
              </View>
              <Text
                style={{ fontFamily: 'Inter_700Bold' }}
                className="text-xs text-[#666] dark:text-[#999]"
              >
                {item.id}
              </Text>
            </View>

            {/* Bottom Section: Value and Label */}
            <View className="mt-auto">
              <Text
                style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
                className="text-5xl text-[#1a1a1a] dark:text-[#f3f4f6]"
              >
                {item.value}
              </Text>
              <Text
                style={{ fontFamily: 'Inter_700Bold' }}
                className="text-[10px] text-[#666] dark:text-[#999] mt-2 tracking-widest"
              >
                {item.label}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

