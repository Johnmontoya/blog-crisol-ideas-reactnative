import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetDashboardQueries } from '@/queries/query/blog.query';
import { useGetUserIdQueries } from '@/queries/query/user.query';
import { useAuthStore } from '@/store/auth';
import { FileText, MessageSquareWarning, Trash, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function DashboardScreen() {
  const { userId } = useAuthStore();
  const data = useGetUserIdQueries(userId)
  const colorScheme = useColorScheme() ?? 'light';
  const user = data[0].data?.user;
  const [stats] = useGetDashboardQueries();
  const dashboardData = stats?.data?.Blogs;

  return (
    <ScrollView
      className="flex-1 bg-[#f8f9fa] dark:bg-[#0a0a0a]"
      contentContainerStyle={{ padding: 24, paddingTop: 64 }}
    >
      {/* Stats Grid */}
      {
        user?.role === 'Admin' ? (
          <View className="flex-row flex-wrap justify-between mb-8">
            <View className="w-[48%] p-5 rounded-3xl bg-white dark:bg-[#1a1a1a] shadow-sm elevation-3 mb-4">
              <FileText size={24} color="#7c3aed" />
              <Text className="text-2xl font-bold mt-3 text-[#111827] dark:text-[#f3f4f6]">{dashboardData?.blogs || 0}</Text>
              <Text className="text-sm mt-0.5 text-[#6b7280] dark:text-[#9ca3af]">Published Dispatches</Text>
            </View>
            <View className="w-[48%] p-5 rounded-3xl bg-white dark:bg-[#1a1a1a] shadow-sm elevation-3 mb-4">
              <MessageSquareWarning size={24} color="#7c3aed" />
              <Text className="text-2xl font-bold mt-3 text-[#111827] dark:text-[#f3f4f6]">{dashboardData?.comments || 0}</Text>
              <Text className="text-sm mt-0.5 text-[#6b7280] dark:text-[#9ca3af]">Public Comments</Text>
            </View>
            <View className="w-[48%] p-5 rounded-3xl bg-white dark:bg-[#1a1a1a] shadow-sm elevation-3 mb-4">
              <Trash size={24} color="#7c3aed" />
              <Text className="text-2xl font-bold mt-3 text-[#111827] dark:text-[#f3f4f6]">{dashboardData?.drafts || 0}</Text>
              <Text className="text-sm mt-0.5 text-[#6b7280] dark:text-[#9ca3af]">Unpublished Drafts</Text>
            </View>
            <View className="w-[48%] p-5 rounded-3xl bg-white dark:bg-[#1a1a1a] shadow-sm elevation-3 mb-4">
              <User size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold mt-3 text-[#111827] dark:text-[#f3f4f6]">{dashboardData?.users || 0}</Text>
              <Text className="text-sm mt-0.5 text-[#6b7280] dark:text-[#9ca3af]">Registered Users</Text>
            </View>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between mb-8">
          </View>
        )}
    </ScrollView>
  );
}

