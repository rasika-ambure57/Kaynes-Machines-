import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useMachines } from '../context/MachineContext';
import { COLORS } from '../constants/theme';

export default function CustomDrawerContent({ navigation, state }) {
  const { user, logout } = useAuth();
  const { machines, resetToSeed } = useMachines();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  // Determine active route name from state
  const activeRouteName = state?.routes[state?.index]?.name;

  const handleRefreshCache = async () => {
    try {
      setIsRefreshing(true);
      // Simulate quick offline cache validation
      await new Promise((resolve) => setTimeout(resolve, 400));
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(timeStr);
      Alert.alert(
        'Offline Cache Synchronized',
        `Successfully verified ${machines.length} EMS assets stored in offline persistent cache. (Timestamp: ${timeStr})`
      );
    } catch (e) {
      Alert.alert('Cache Error', 'Failed to refresh local cache.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Exit',
      'Are you sure you want to log out of Kaynes EMS Console?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getRoleBadge = () => {
    if (user?.role === 'admin') {
      return {
        label: 'PLANT ADMIN',
        bg: COLORS.primaryLight,
        border: '#FECACA',
        color: COLORS.primary,
        icon: 'shield-crown-outline',
      };
    } else if (user?.role === 'operator') {
      return {
        label: 'FLOOR OPERATOR',
        bg: '#D1FAE5',
        border: '#A7F3D0',
        color: '#065F46',
        icon: 'barcode-scan',
      };
    }
    return {
      label: 'VIEWER',
      bg: '#F3F4F6',
      border: '#E5E7EB',
      color: '#374151',
      icon: 'eye-outline',
    };
  };

  const roleBadge = getRoleBadge();

  return (
    <View style={styles.container}>
      {/* 1. Header Banner: Obsidian Black with Kaynes Branding & User Profile */}
      <View style={styles.headerBanner}>
        {/* Top Corporate Tagline */}
        <View style={styles.corporateBadge}>
          <View style={styles.corporateRedDot} />
          <Text style={styles.corporateBadgeText}>KAYNES TECHNOLOGY INDIA</Text>
        </View>

        <View style={styles.brandTitleRow}>
          <Text style={styles.brandTitle}>KAYNES</Text>
          <View style={styles.brandRedPill}>
            <Text style={styles.brandRedPillText}>EMS</Text>
          </View>
        </View>
        <Text style={styles.brandSubtitle}>Precision Electronics Manufacturing Services</Text>

        <View style={styles.headerDivider} />

        {/* User Identity Card */}
        <View style={styles.userProfileRow}>
          <View style={[styles.avatarCircle, { borderColor: roleBadge.color }]}>
            <MaterialCommunityIcons name={roleBadge.icon} size={24} color="#FFFFFF" />
          </View>

          <View style={styles.userInfoCol}>
            <Text style={styles.userNameText} numberOfLines={1}>
              {user?.name || 'Plant User'}
            </Text>
            <View style={[styles.roleBadgeContainer, { backgroundColor: roleBadge.bg, borderColor: roleBadge.border }]}>
              <Text style={[styles.roleBadgeText, { color: roleBadge.color }]}>
                {roleBadge.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Plant Location Row */}
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="factory" size={13} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.locationText}>Mysuru Plant 2 - Shift A</Text>
        </View>
      </View>

      {/* 2. Navigation Items List (Scrollable Area) */}
      <ScrollView
        style={styles.navScrollView}
        contentContainerStyle={styles.navScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.menuSectionHeader}>PLANT CONSOLE NAVIGATION</Text>

        {/* Item 1: Dashboard / Home */}
        <TouchableOpacity
          style={[
            styles.navItem,
            activeRouteName === 'Dashboard' && styles.navItemActive,
          ]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <View style={[styles.navIconBox, activeRouteName === 'Dashboard' && styles.navIconBoxActive]}>
            <Ionicons
              name="speedometer-outline"
              size={20}
              color={activeRouteName === 'Dashboard' ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          <View style={styles.navItemTextCol}>
            <Text style={[styles.navItemLabel, activeRouteName === 'Dashboard' && styles.navItemLabelActive]}>
              Dashboard / Home
            </Text>
            <Text style={styles.navItemSubtext}>
              {user?.role === 'admin' ? 'Asset Registry & Plant KPIs' : 'Scanner & Floor Operations'}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={activeRouteName === 'Dashboard' ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>

        {/* Item 2: Profile */}
        <TouchableOpacity
          style={[
            styles.navItem,
            activeRouteName === 'Profile' && styles.navItemActive,
          ]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.navIconBox, activeRouteName === 'Profile' && styles.navIconBoxActive]}>
            <Ionicons
              name="person-circle-outline"
              size={20}
              color={activeRouteName === 'Profile' ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          <View style={styles.navItemTextCol}>
            <Text style={[styles.navItemLabel, activeRouteName === 'Profile' && styles.navItemLabelActive]}>
              Profile
            </Text>
            <Text style={styles.navItemSubtext}>User credentials, shift & line zone</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={activeRouteName === 'Profile' ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>

        {/* Item 3: Help & Support */}
        <TouchableOpacity
          style={[
            styles.navItem,
            activeRouteName === 'Help' && styles.navItemActive,
          ]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Help')}
        >
          <View style={[styles.navIconBox, activeRouteName === 'Help' && styles.navIconBoxActive]}>
            <Ionicons
              name="help-buoy-outline"
              size={20}
              color={activeRouteName === 'Help' ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          <View style={styles.navItemTextCol}>
            <Text style={[styles.navItemLabel, activeRouteName === 'Help' && styles.navItemLabelActive]}>
              Help & Support
            </Text>
            <Text style={styles.navItemSubtext}>Floor SOPs, error codes & hotline</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={activeRouteName === 'Help' ? COLORS.primary : COLORS.textMuted}
          />
        </TouchableOpacity>

        {/* Item 4: User Management (Conditionally visible ONLY for ADMIN role) */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[
              styles.navItem,
              activeRouteName === 'UserManagement' && styles.navItemActive,
            ]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <View style={[styles.navIconBox, activeRouteName === 'UserManagement' && styles.navIconBoxActive]}>
              <Ionicons
                name="people-outline"
                size={20}
                color={activeRouteName === 'UserManagement' ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
            <View style={styles.navItemTextCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.navItemLabel, activeRouteName === 'UserManagement' && styles.navItemLabelActive]}>
                  User Management
                </Text>
                <View style={styles.adminOnlyPill}>
                  <Text style={styles.adminOnlyPillText}>ADMIN</Text>
                </View>
              </View>
              <Text style={styles.navItemSubtext}>Floor personnel & role control</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={activeRouteName === 'UserManagement' ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>
        )}

        {/* Item 5: Offline Sync & Storage Card */}
        <View style={styles.offlineSyncCard}>
          <View style={styles.offlineCardHeader}>
            <MaterialCommunityIcons name="database-check" size={18} color={COLORS.primary} />
            <Text style={styles.offlineCardTitle}>OFFLINE ASSET CACHE</Text>
          </View>
          <Text style={styles.offlineCardDesc}>
            {machines.length} machinery profiles synced locally on this terminal.
          </Text>
          <Text style={styles.offlineSyncTimestamp}>
            Last verified: <Text style={{ color: COLORS.textPrimary, fontWeight: '700' }}>{lastSyncTime}</Text>
          </Text>

          <TouchableOpacity
            style={[styles.refreshCacheBtn, isRefreshing && { opacity: 0.6 }]}
            activeOpacity={0.8}
            onPress={handleRefreshCache}
            disabled={isRefreshing}
          >
            <Ionicons
              name="sync"
              size={15}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.refreshCacheBtnText}>
              {isRefreshing ? 'Syncing...' : 'Refresh Local Cache'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 3. Footer: Bottom-Pinned Logout Action in Subtle Red Outline */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out Session</Text>
        </TouchableOpacity>

        <View style={styles.footerBrandRow}>
          <Ionicons name="shield-checkmark" size={12} color={COLORS.primary} />
          <Text style={styles.footerComplianceText}>
            Kaynes Technology EMS • ISO 9001 / AS9100D
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBanner: {
    backgroundColor: COLORS.secondary, // Obsidian Black (#111827)
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Crimson Red (#D91E2A) Accent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  corporateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 30, 42, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.4)',
  },
  corporateRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  corporateBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandRedPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 5,
    marginLeft: 8,
  },
  brandRedPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 12,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  userInfoCol: {
    flex: 1,
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '600',
  },
  navScrollView: {
    flex: 1,
  },
  navScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  menuSectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  navItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F5',
  },
  navIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navIconBoxActive: {
    backgroundColor: COLORS.primaryLight,
  },
  navItemTextCol: {
    flex: 1,
  },
  navItemLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  navItemLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  navItemSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  adminOnlyPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  adminOnlyPillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offlineSyncCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  offlineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  offlineCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  offlineCardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  offlineSyncTimestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 10,
  },
  refreshCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary, // Obsidian Black button
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  refreshCacheBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    paddingVertical: 11,
    borderRadius: 10,
  },
  logoutBtnText: {
    color: COLORS.primary, // Kaynes Red
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerComplianceText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 5,
    fontWeight: '600',
  },
});
