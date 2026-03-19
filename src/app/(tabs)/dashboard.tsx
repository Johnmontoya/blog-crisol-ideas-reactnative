import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetUserIdQueries } from '@/queries/query/user.query';
import { useAuthStore } from '@/store/auth';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const { userId } = useAuthStore();
  const data = useGetUserIdQueries(userId)
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const user = data[0].data?.user;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#f8f9fa' }]}
      contentContainerStyle={styles.content}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280' }]}>
            Bienvenido,
          </Text>
          <Text style={[styles.userName, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>
            {user?.username || 'Usuario'}
          </Text>
        </View>
        <LinearGradient
          colors={['#7c3aed', '#c084fc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarCircle}
        >
          <Text style={styles.avatarInitial}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </LinearGradient>
      </View>

      {/* Stats Grid */}
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <IconSymbol name="paperplane.fill" size={24} color="#7c3aed" />
          <Text style={[styles.cardValue, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>12</Text>
          <Text style={[styles.cardLabel, { color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280' }]}>Blogs</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
          <IconSymbol name="person.fill" size={24} color="#3b82f6" />
          <Text style={[styles.cardValue, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>1.2k</Text>
          <Text style={[styles.cardLabel, { color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280' }]}>Seguidores</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>
        Actividad Reciente
      </Text>

      <View style={[styles.activityList, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.activityItem}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
            <IconSymbol name="plus" size={20} color="#7c3aed" />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>
              Nuevo blog publicado
            </Text>
            <Text style={[styles.activityTime, { color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280' }]}>
              Hace 2 horas
            </Text>
          </View>
        </View>

        <View style={[styles.activityDivider, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]} />

        <View style={styles.activityItem}>
          <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <IconSymbol name="person.fill" size={20} color="#3b82f6" />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>
              Nuevo seguidor: Maria
            </Text>
            <Text style={[styles.activityTime, { color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280' }]}>
              Hace 5 horas
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#111827' }]}>
        Acciones Rápidas
      </Text>

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, { backgroundColor: '#7c3aed' }]}>
          <IconSymbol name="plus" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Crear Blog</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, { backgroundColor: colorScheme === 'dark' ? '#333' : '#e5e7eb' }]}>
          <IconSymbol name="paperplane.fill" size={24} color={colorScheme === 'dark' ? '#fff' : '#111827'} />
          <Text style={[styles.actionButtonText, { color: colorScheme === 'dark' ? '#fff' : '#111827' }]}>Explorar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 64,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginTop: 2,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 16,
  },
  activityList: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  activityTime: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  activityDivider: {
    height: 1,
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
