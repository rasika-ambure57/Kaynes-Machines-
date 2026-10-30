import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();

  const getRolePermissions = () => {
    if (user?.role === 'admin') {
      return [
        { title: 'Machine Registry Management', desc: 'Create, update, and decommission plant assets', allowed: true },
        { title: 'Live QR Tag Generator', desc: 'Encode unique asset barcodes for chassis labeling', allowed: true },
        { title: 'One-Tap Status Overrides', desc: 'Override machine operational status on any line', allowed: true },
        { title: 'User & Shift Management', desc: 'Manage technician assignments and line permissions', allowed: true },
        { title: 'Factory Telemetry Audit', desc: 'Full access to equipment uptime metrics and logs', allowed: true },
      ];
    } else if (user?.role === 'operator') {
      return [
        { title: 'Floor Optical QR Scanning', desc: 'Scan chassis barcodes with device camera', allowed: true },
        { title: 'One-Tap Status Overrides', desc: 'Toggle machine state to Active, Maint, or Down', allowed: true },
        { title: 'Service Note & History Logging', desc: 'Record technician actions with timestamps', allowed: true },
        { title: 'Offline Machine Inspection', desc: 'Audit machine specs and historical logs', allowed: true },
        { title: 'Machine Registry Management', desc: 'Create or delete machinery from plant database', allowed: false },
        { title: 'User & Shift Configuration', desc: 'Assign roles to other operators', allowed: false },
      ];
    }
    return [
      { title: 'Machine Dossier Audit', desc: 'Inspect hardware specs, serials, and installation dates', allowed: true },
      { title: 'Maintenance History Inspection', desc: 'Review chronological service logs and technician notes', allowed: true },
      { title: 'Factory Health Metrics', desc: 'Monitor plant-wide KPIs and line breakdowns', allowed: true },
      { title: 'One-Tap Status Overrides', desc: 'Modify machine status (restricted to operators/admins)', allowed: false },
      { title: 'Machine Registry Management', desc: 'Register or modify equipment records', allowed: false },
    ];
  };

  const getRoleInfo = () => {
    if (user?.role === 'admin') {
      return {
        badge: 'PLANT ADMIN',
        badgeBg: COLORS.primaryLight,
        badgeColor: COLORS.primary,
        empId: 'KYN-ADM-1082',
        email: `${(user?.name || 'admin').toLowerCase().replace(/\s+/g, '.')}@kaynestechnology.net`,
        line: 'Entire Mysuru EMS Facility (All Lines)',
      };
    } else if (user?.role === 'operator') {
      return {
        badge: 'FLOOR OPERATOR',
        badgeBg: '#D1FAE5',
        badgeColor: '#065F46',
        empId: 'KYN-OPR-4419',
        email: `${(user?.name || 'operator').toLowerCase().replace(/\s+/g, '.')}@kaynestechnology.net`,
        line: 'SMT Line 1 & Quality Gate 1',
      };
    }
    return {
      badge: 'VIEWER',
      badgeBg: '#F3F4F6',
      badgeColor: '#374151',
      empId: 'KYN-VWR-9020',
      email: `${(user?.name || 'viewer').toLowerCase().replace(/\s+/g, '.')}@kaynestechnology.net`,
      line: 'Factory Telemetry & Quality Assurance Bay',
    };
  };

  const roleInfo = getRoleInfo();
  const permissions = getRolePermissions();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Screen App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.appBarCenter}>
          <Text style={styles.appBarTitle}>Operator Profile</Text>
          <Text style={styles.appBarSubtitle}>Kaynes EMS Credentials</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Details Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarLarge}>
              <MaterialCommunityIcons name="account-tie" size={38} color="#FFFFFF" />
            </View>
            <View style={styles.profileTitleCol}>
              <Text style={styles.profileName}>{user?.name || 'Plant Personnel'}</Text>
              <View style={[styles.roleBadge, { backgroundColor: roleInfo.badgeBg }]}>
                <Text style={[styles.roleBadgeText, { color: roleInfo.badgeColor }]}>
                  {roleInfo.badge}
                </Text>
              </View>
              <Text style={styles.empIdText}>ID: {roleInfo.empId}</Text>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.metaRow}>
            <Ionicons name="mail-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
            <Text style={styles.metaLabel}>Corporate Email:</Text>
            <Text style={styles.metaValue}>{roleInfo.email}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.active} style={{ marginRight: 8 }} />
            <Text style={styles.metaLabel}>Safety Certification:</Text>
            <Text style={styles.metaValue}>ESD-Safe Class 0 • IPC-A-610</Text>
          </View>
        </View>

        {/* Shift Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardHeading}>ASSIGNED SHIFT & FACILITY</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Shift Schedule</Text>
              <Text style={styles.infoValue}>Shift A (06:00 - 14:30 IST)</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Terminal Status</Text>
              <View style={styles.statusOnlinePill}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusOnlineText}>Active On Shift</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Facility Location</Text>
              <Text style={styles.infoValue}>Mysuru Plant 2, Karnataka</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Assigned Line / Bay</Text>
              <Text style={[styles.infoValue, { color: COLORS.primary }]}>{roleInfo.line}</Text>
            </View>
          </View>
        </View>

        {/* Role Permissions List */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="security" size={18} color={COLORS.primary} />
            <Text style={styles.cardHeading}>ROLE PERMISSIONS & SCOPE</Text>
          </View>

          {permissions.map((perm, idx) => (
            <View key={idx} style={styles.permissionItem}>
              <Ionicons
                name={perm.allowed ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={perm.allowed ? COLORS.active : COLORS.textMuted}
                style={styles.permIcon}
              />
              <View style={styles.permTextCol}>
                <Text style={[styles.permTitle, !perm.allowed && { color: COLORS.textMuted }]}>
                  {perm.title}
                </Text>
                <Text style={styles.permDesc}>{perm.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appBar: {
    backgroundColor: COLORS.secondary,
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  menuButton: {
    padding: 4,
  },
  appBarCenter: {
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  appBarSubtitle: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 14,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    marginRight: 14,
  },
  profileTitleCol: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  empIdText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  profileDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  metaValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '100%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  statusOnlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 3,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.active,
    marginRight: 6,
  },
  statusOnlineText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  permIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  permTextCol: {
    flex: 1,
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  permDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
    lineHeight: 15,
  },
});
