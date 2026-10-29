import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useMachines } from '../../context/MachineContext';
import { COLORS } from '../../constants/theme';

export default function OperatorDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const { machines, getMachineById } = useMachines();

  const [manualId, setManualId] = useState('');

  const handleManualLookup = () => {
    if (!manualId.trim()) {
      Alert.alert('Input Required', 'Please enter a Machine Tag ID or Serial Number.');
      return;
    }

    const machine = getMachineById(manualId);
    if (machine) {
      setManualId('');
      navigation.navigate('MachineDetailScreen', { machineId: machine.id });
    } else {
      Alert.alert(
        'Machine Not Found',
        `No asset matching "${manualId.trim()}" was found in the plant registry. Verify the tag or try scanning the QR code.`
      );
    }
  };

  const renderStatusPill = (status) => {
    let bg = COLORS.activeBg;
    let text = COLORS.activeText;
    let border = COLORS.activeBorder;

    if (status === 'MAINTENANCE') {
      bg = COLORS.maintenanceBg;
      text = COLORS.maintenanceText;
      border = COLORS.maintenanceBorder;
    } else if (status === 'DOWN') {
      bg = COLORS.downBg;
      text = COLORS.downText;
      border = COLORS.downBorder;
    }

    return (
      <View style={[styles.statusPill, { backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.statusPillText, { color: text }]}>{status}</Text>
      </View>
    );
  };

  const renderRecentMachineItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recentCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MachineDetailScreen', { machineId: item.id })}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.idBadge}>
          <MaterialCommunityIcons name="barcode-scan" size={15} color={COLORS.primary} />
          <Text style={styles.idBadgeText}>{item.id}</Text>
        </View>
        {renderStatusPill(item.status)}
      </View>

      <Text style={styles.recentMachineName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.recentMachineLine}>
        {item.line || item.department}
      </Text>

      <View style={styles.cardBottomRow}>
        <Text style={styles.recentServiceText}>
          Last Activity: <Text style={{ fontWeight: '700', color: COLORS.textPrimary }}>{item.lastServiced}</Text>
        </Text>
        <View style={styles.inspectAction}>
          <Text style={styles.inspectText}>Inspect</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Top Header in Obsidian Black with Crimson Accent */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.shopBadge}>
            <View style={styles.redDot} />
            <Text style={styles.shopBadgeText}>KAYNES FLOOR CONSOLE</Text>
          </View>
          <Text style={styles.operatorTitle}>Shop Floor Operations</Text>
          <Text style={styles.operatorName}>
            Active Operator: <Text style={{ color: COLORS.primaryLight, fontWeight: '700' }}>{user?.name || 'Floor Operator'}</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.logoutBtnText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        renderItem={renderRecentMachineItem}
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Primary Action Button: 'Scan Machine QR Code' in Bold Kaynes Red */}
            <TouchableOpacity
              style={styles.heroScanButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('QRScannerScreen')}
            >
              <View style={styles.heroScanContent}>
                <View style={styles.heroIconBox}>
                  <MaterialCommunityIcons name="qrcode-scan" size={36} color="#FFFFFF" />
                </View>
                <View style={styles.heroTextBox}>
                  <View style={styles.heroActionTag}>
                    <Text style={styles.heroActionTagText}>PRIMARY FLOOR ACTION</Text>
                  </View>
                  <Text style={styles.heroTitle}>Scan Machine QR Code</Text>
                  <Text style={styles.heroSubtitle}>
                    Point device camera at any asset tag to inspect specs, toggle states, or log service.
                  </Text>
                </View>
              </View>

              <View style={styles.heroFooter}>
                <Text style={styles.heroFooterText}>Launch Optical Scanner</Text>
                <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Manual ID Lookup Search Bar */}
            <View style={styles.manualLookupSection}>
              <View style={styles.lookupTitleRow}>
                <MaterialCommunityIcons name="keyboard-outline" size={18} color={COLORS.primary} />
                <Text style={styles.lookupTitle}>MANUAL ASSET TAG LOOKUP</Text>
              </View>
              <Text style={styles.lookupSubtitle}>
                Fallback if camera is unavailable or barcode is physically degraded
              </Text>

              <View style={styles.lookupInputWrapper}>
                <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.lookupInputIcon} />
                <TextInput
                  style={styles.lookupInput}
                  placeholder="e.g. KYN-SMT-001 or KYN-CLN-005"
                  placeholderTextColor={COLORS.textMuted}
                  value={manualId}
                  onChangeText={setManualId}
                  autoCapitalize="characters"
                  onSubmitEditing={handleManualLookup}
                  returnKeyType="search"
                />
                {manualId.length > 0 && (
                  <TouchableOpacity onPress={() => setManualId('')} style={{ marginRight: 8 }}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.lookupSubmitBtn}
                  onPress={handleManualLookup}
                  activeOpacity={0.7}
                >
                  <Text style={styles.lookupSubmitBtnText}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Registered Floor Machinery Section Header */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>REGISTERED FLOOR MACHINERY</Text>
                <Text style={styles.sectionSubheading}>Tap any unit below to view details and log service</Text>
              </View>
              <View style={styles.machineCountBadge}>
                <Text style={styles.machineCountText}>{machines.length} Total</Text>
              </View>
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Kaynes Crimson Red Line
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  headerLeft: {
    flex: 1,
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 30, 42, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.4)',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  shopBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  operatorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  operatorName: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  heroScanButton: {
    backgroundColor: COLORS.primary, // Bold Kaynes Crimson Red
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  heroScanContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroIconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroTextBox: {
    flex: 1,
  },
  heroActionTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  heroActionTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    color: '#FEE2E2',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroFooterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  manualLookupSection: {
    backgroundColor: COLORS.surface,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lookupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lookupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  lookupSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    marginBottom: 10,
  },
  lookupInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
  },
  lookupInputIcon: {
    marginRight: 8,
  },
  lookupInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  lookupSubmitBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lookupSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  sectionSubheading: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  machineCountBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  machineCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  recentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.25)',
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    marginLeft: 5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recentMachineName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  recentMachineLine: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  recentServiceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  inspectAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginRight: 4,
  },
});
