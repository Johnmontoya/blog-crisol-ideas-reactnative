import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/UserContextProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // Placeholder date for "ESTABLISHED"
  const establishedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff' }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.dossierTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
          Dossier.
        </Text>
        <Text style={[styles.dossierSubtitle, { color: colorScheme === 'dark' ? '#9ca3af' : '#666' }]}>
          Identity and credentials on record.
        </Text>
        <View style={[styles.separator, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]} />
      </View>

      <View style={styles.mainLayout}>
        {/* Left Column: ID Card */}
        <View style={styles.leftColumn}>
          <View style={[styles.idCard, { borderColor: colorScheme === 'dark' ? '#444' : '#000' }]}>
            {/* Decorative corners */}
            <View style={[styles.cornerBox, styles.topRightCorner, { borderColor: colorScheme === 'dark' ? '#444' : '#000' }]} />
            <View style={[styles.cornerBox, styles.bottomLeftCorner, { borderColor: colorScheme === 'dark' ? '#444' : '#000' }]} />

            <View style={styles.avatarContainer}>
              <IconSymbol name="person.fill" size={48} color={colorScheme === 'dark' ? '#f3f4f6' : '#000'} />
            </View>

            <Text style={[styles.userName, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
              {user?.username || 'User'}
            </Text>
            <Text style={[styles.userEmailSmall, { color: colorScheme === 'dark' ? '#9ca3af' : '#666' }]}>
              {user?.email || 'N/A'}
            </Text>

            <View style={[styles.idCardBottomBox, { borderColor: colorScheme === 'dark' ? '#444' : '#000' }]} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              { borderStyle: 'dashed' },
              pressed && { opacity: 0.7 }
            ]}
            onPress={logout}
          >
            <Text style={styles.logoutText}>TERMINAL OFF</Text>
          </Pressable>
        </View>

        {/* Right Column: Details */}
        <View style={styles.rightColumn}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
              Biography
            </Text>
            <Text style={[styles.bodyText, { color: colorScheme === 'dark' ? '#9ca3af' : '#555' }]}>
              A discerning contributor to the historical record. Engaged in the critical analysis of emerging thought and established doctrine.
            </Text>
            <View style={[styles.miniSeparator, { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' }]} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
              Clearance Details
            </Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="envelope.fill" size={12} color="#f97316" />
                  <Text style={styles.detailLabel}>COMM LINK</Text>
                </View>
                <Text style={[styles.detailValue, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
                  {user?.email}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="person.fill" size={12} color="#f97316" />
                  <Text style={styles.detailLabel}>CLEARANCE LEVEL</Text>
                </View>
                <Text style={[styles.detailValue, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
                  User
                </Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="calendar" size={12} color="#f97316" />
                  <Text style={styles.detailLabel}>ESTABLISHED</Text>
                </View>
                <Text style={[styles.detailValue, { color: colorScheme === 'dark' ? '#f3f4f6' : '#000' }]}>
                  {establishedDate}
                </Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  dossierTitle: {
    fontSize: 56,
    fontFamily: 'PlayfairDisplay_700Bold',
    lineHeight: 64,
  },
  dossierSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  separator: {
    height: 1,
    width: '100%',
    marginTop: 24,
  },
  mainLayout: {
    flexDirection: width > 600 ? 'row' : 'column',
    gap: 32,
  },
  leftColumn: {
    width: width > 600 ? 240 : '100%',
    alignItems: 'center',
  },
  idCard: {
    width: 220,
    height: 300,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cornerBox: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 1,
  },
  topRightCorner: {
    top: -1,
    right: -1,
  },
  bottomLeftCorner: {
    bottom: -1,
    left: -1,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    textAlign: 'center',
  },
  userEmailSmall: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  idCardBottomBox: {
    position: 'absolute',
    bottom: 40,
    width: 180,
    height: 48,
    borderWidth: 1,
  },
  rightColumn: {
    flex: 1,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  miniSeparator: {
    height: 1,
    width: '100%',
    marginTop: 32,
  },
  detailsGrid: {
    gap: 24,
  },
  detailItem: {
    gap: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#f97316',
    letterSpacing: 1.2,
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
  },
});
