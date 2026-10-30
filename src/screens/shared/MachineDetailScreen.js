import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function MachineDetailScreen({ route, navigation }) {
  const { machineId } = route.params || {};
  const { machines, updateMachineStatus } = useMachines();
  const { user } = useAuth();

  const machine = machines.find((m) => m.id === machineId);

  // Status Change Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [targetStatus, setTargetStatus] = useState(null);
  const [operatorNote, setOperatorNote] = useState('');
  const [operatorName, setOperatorName] = useState(user?.name || 'Floor Operator');
  const [isInputFocused, setIsInputFocused] = useState(false);

  if (!machine) {
    return (
      <View style={styles.notFoundContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color={COLORS.primary} />
        <Text style={styles.notFoundTitle}>Machine Not Found</Text>
        <Text style={styles.notFoundSubtitle}>
          No asset with ID "{machineId}" exists in the plant registry.
        </Text>
        <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.backBtnActionText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleOpenStatusModal = (status) => {
    if (user?.role === 'viewer') {
      Alert.alert(
        'Read-Only Access',
        'Viewer accounts are restricted to auditing specs and maintenance logs. Status overrides require Floor Operator or Plant Admin credentials.'
      );
      return;
    }
    setTargetStatus(status);
    setOperatorNote('');
    setModalVisible(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!targetStatus) return;

    await updateMachineStatus(
      machine.id,
      targetStatus,
      operatorNote.trim() || `Status updated to ${targetStatus}`,
      operatorName.trim() || user?.name || 'Operator'
    );

    setModalVisible(false);
    Alert.alert('Status Updated', `Asset ${machine.id} is now ${targetStatus}.`);
  };

  const getQuickNoteSuggestions = () => {
    switch (targetStatus) {
      case 'ACTIVE':
        return ['Preventive Maintenance Passed', 'Calibration Verified', 'Production Resumed', 'Nozzle Replaced'];
      case 'MAINTENANCE':
        return ['Scheduled Filter Cleaning', 'Vision Alignment Check', 'Thermal Profile Calibration', 'Feeder Jam Cleared'];
      case 'DOWN':
        return ['Critical Conveyor Failure', 'Overheat Emergency Stop', 'Optical Sensor Fault', 'Transducer Leak Detected'];
      default:
        return [];
    }
  };

  // Status Banner styling helper
  const getStatusBannerConfig = () => {
    switch (machine.status) {
      case 'ACTIVE':
        return {
          bg: COLORS.activeBg,
          borderColor: COLORS.activeBorder,
          textColor: COLORS.activeText,
          icon: 'checkbox-marked-circle-outline',
          iconColor: COLORS.active,
          headline: 'ACTIVE & OPERATIONAL',
          subtext: 'Operating at nominal throughput • No active fault alarms',
        };
      case 'MAINTENANCE':
        return {
          bg: COLORS.maintenanceBg,
          borderColor: COLORS.maintenanceBorder,
          textColor: COLORS.maintenanceText,
          icon: 'wrench-clock',
          iconColor: COLORS.maintenance,
          headline: 'UNDER MAINTENANCE / CALIBRATION',
          subtext: 'Service in progress or scheduled inspection required',
        };
      case 'DOWN':
        return {
          bg: COLORS.downBg,
          borderColor: COLORS.downBorder,
          textColor: COLORS.downText,
          icon: 'alert-octagon',
          iconColor: COLORS.primary,
          headline: 'CRITICAL LINE BREAKDOWN',
          subtext: 'Emergency stop or machine failure • Immediate attention required',
        };
      default:
        return {
          bg: COLORS.surfaceSubtle,
          borderColor: COLORS.border,
          textColor: COLORS.textPrimary,
          icon: 'information',
          iconColor: COLORS.textMuted,
          headline: machine.status,
          subtext: 'Status recorded in registry',
        };
    }
  };

  const banner = getStatusBannerConfig();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* App Bar in Obsidian Black with Kaynes Red Accent */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.appBarCenter}>
          <Text style={styles.appBarTitle}>{machine.id}</Text>
          <Text style={styles.appBarSubtitle}>Kaynes Asset Dossier</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large Current Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: banner.bg, borderColor: banner.borderColor }]}>
          <View style={styles.statusBannerTop}>
            <MaterialCommunityIcons name={banner.icon} size={32} color={banner.iconColor} />
            <View style={styles.statusBannerTextWrap}>
              <Text style={[styles.statusBannerHeadline, { color: banner.textColor }]}>
                {banner.headline}
              </Text>
              <Text style={[styles.statusBannerSubtext, { color: banner.textColor }]}>
                {banner.subtext}
              </Text>
            </View>
          </View>
        </View>

        {/* Machine Identity Card */}
        <View style={styles.identityCard}>
          <Text style={styles.machineMainName}>{machine.name}</Text>
          <Text style={styles.machineDepartment}>{machine.department} • {machine.line || 'Main Line'}</Text>

          {/* Quick Status Action Buttons */}
          <View style={styles.statusActionSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={styles.statusActionLabel}>ONE-TAP STATUS OVERRIDE</Text>
              {user?.role === 'viewer' && (
                <View style={styles.viewerBadge}>
                  <Ionicons name="lock-closed" size={10} color={COLORS.textSecondary} style={{ marginRight: 3 }} />
                  <Text style={styles.viewerBadgeText}>READ-ONLY</Text>
                </View>
              )}
            </View>
            <View style={styles.statusButtonGroup}>
              {/* Set Active */}
              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  machine.status === 'ACTIVE'
                    ? { backgroundColor: '#ECFDF5', borderColor: COLORS.active }
                    : { backgroundColor: COLORS.surfaceSubtle },
                ]}
                activeOpacity={0.7}
                onPress={() => handleOpenStatusModal('ACTIVE')}
              >
                <View style={[styles.statusDot, { backgroundColor: COLORS.active }]} />
                <Text style={[styles.statusToggleBtnText, machine.status === 'ACTIVE' && { color: COLORS.activeText, fontWeight: '800' }]}>
                  Set Active
                </Text>
              </TouchableOpacity>

              {/* Set Maintenance */}
              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  machine.status === 'MAINTENANCE'
                    ? { backgroundColor: '#FFFBEB', borderColor: COLORS.maintenance }
                    : { backgroundColor: COLORS.surfaceSubtle },
                ]}
                activeOpacity={0.7}
                onPress={() => handleOpenStatusModal('MAINTENANCE')}
              >
                <View style={[styles.statusDot, { backgroundColor: COLORS.maintenance }]} />
                <Text style={[styles.statusToggleBtnText, machine.status === 'MAINTENANCE' && { color: COLORS.maintenanceText, fontWeight: '800' }]}>
                  Set Maint.
                </Text>
              </TouchableOpacity>

              {/* Set Down */}
              <TouchableOpacity
                style={[
                  styles.statusToggleBtn,
                  machine.status === 'DOWN'
                    ? { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary }
                    : { backgroundColor: COLORS.surfaceSubtle },
                ]}
                activeOpacity={0.7}
                onPress={() => handleOpenStatusModal('DOWN')}
              >
                <View style={[styles.statusDot, { backgroundColor: COLORS.primary }]} />
                <Text style={[styles.statusToggleBtnText, machine.status === 'DOWN' && { color: COLORS.primary, fontWeight: '800' }]}>
                  Set Down
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hardware Specifications Section */}
        <View style={styles.specCard}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="chip" size={18} color={COLORS.primary} />
            <Text style={styles.sectionHeading}>HARDWARE & COMMISSION SPECIFICATIONS</Text>
          </View>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Model Number</Text>
              <Text style={styles.specValue}>{machine.model || machine.modelNumber}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Serial Number</Text>
              <Text style={styles.specValue}>{machine.serialNumber}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Plant Department</Text>
              <Text style={styles.specValue}>{machine.department}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Station / Bay</Text>
              <Text style={styles.specValue}>{machine.line || 'SMT Line 1'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Install / Commission Date</Text>
              <Text style={styles.specValue}>{machine.installDate || '2023-01-15'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Last Serviced</Text>
              <Text style={[styles.specValue, { color: COLORS.primary, fontWeight: '800' }]}>
                {machine.lastServiced}
              </Text>
            </View>
          </View>
        </View>

        {/* Embedded QR Code Display in Dark Obsidian Frame with Red Corners */}
        <View style={styles.qrBadgeCard}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="qrcode-scan" size={18} color={COLORS.primary} />
            <Text style={styles.sectionHeading}>OFFICIAL ASSET QR BADGE</Text>
          </View>
          <Text style={styles.qrBadgeInstruction}>
            Scan with floor device camera to recall live telemetry and service logs.
          </Text>

          <View style={styles.qrObsidianWrapper}>
            {/* Red Corner Accents */}
            <View style={[styles.cornerAccent, styles.cornerTL]} />
            <View style={[styles.cornerAccent, styles.cornerTR]} />
            <View style={[styles.cornerAccent, styles.cornerBL]} />
            <View style={[styles.cornerAccent, styles.cornerBR]} />

            <View style={styles.qrWhiteContainer}>
              <QRCode
                value={machine.id}
                size={140}
                color={COLORS.secondary}
                backgroundColor="#FFFFFF"
              />
            </View>
            <View style={styles.qrTagStrip}>
              <Text style={styles.qrTagStripText}>{machine.id}</Text>
            </View>
          </View>
        </View>

        {/* Maintenance History Log Feed */}
        <View style={styles.historyCard}>
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="history" size={18} color={COLORS.primary} />
            <Text style={styles.sectionHeading}>MAINTENANCE & AUDIT HISTORY</Text>
            <View style={styles.logCountBadge}>
              <Text style={styles.logCountText}>{(machine.logs || []).length} Logs</Text>
            </View>
          </View>

          {(!machine.logs || machine.logs.length === 0) ? (
            <Text style={styles.noLogsText}>No maintenance logs recorded yet.</Text>
          ) : (
            machine.logs.map((log, index) => {
              let logBadgeColor = COLORS.active;
              let logBadgeBg = COLORS.activeBg;
              if (log.statusChange === 'MAINTENANCE') {
                logBadgeColor = COLORS.maintenance;
                logBadgeBg = COLORS.maintenanceBg;
              } else if (log.statusChange === 'DOWN') {
                logBadgeColor = COLORS.primary;
                logBadgeBg = COLORS.primaryLight;
              }

              return (
                <View key={log.id || `log-${index}`} style={styles.logItem}>
                  <View style={styles.logHeaderRow}>
                    <View style={[styles.logStatusPill, { backgroundColor: logBadgeBg, borderColor: logBadgeColor }]}>
                      <Text style={[styles.logStatusPillText, { color: logBadgeColor }]}>
                        {log.statusChange || 'LOG'}
                      </Text>
                    </View>
                    <Text style={styles.logTimestamp}>{log.timestamp}</Text>
                  </View>

                  <Text style={styles.logOperator}>
                    Technician: <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>{log.operatorName}</Text>
                  </Text>

                  <Text style={styles.logNotes}>{log.actionNotes}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Status Toggle Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Machine Status</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalTargetRow}>
                <Text style={styles.modalTargetLabel}>New Target State:</Text>
                <View
                  style={[
                    styles.modalStatusPill,
                    targetStatus === 'ACTIVE' && { backgroundColor: COLORS.activeBg, borderColor: COLORS.active },
                    targetStatus === 'MAINTENANCE' && { backgroundColor: COLORS.maintenanceBg, borderColor: COLORS.maintenance },
                    targetStatus === 'DOWN' && { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalStatusPillText,
                      targetStatus === 'ACTIVE' && { color: COLORS.activeText },
                      targetStatus === 'MAINTENANCE' && { color: COLORS.maintenanceText },
                      targetStatus === 'DOWN' && { color: COLORS.primary },
                    ]}
                  >
                    {targetStatus}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalInputLabel}>OPERATOR / TECHNICIAN NAME</Text>
              <TextInput
                style={styles.modalTextInput}
                value={operatorName}
                onChangeText={setOperatorName}
                placeholder="Your name"
              />

              <Text style={[styles.modalInputLabel, { marginTop: 12 }]}>MAINTENANCE NOTES & REASON</Text>
              <TextInput
                style={[
                  styles.modalTextInput,
                  styles.modalNotesInput,
                  isInputFocused && styles.modalNotesInputFocused,
                ]}
                value={operatorNote}
                onChangeText={setOperatorNote}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="e.g. Cleared feeder jam, replaced nozzle head, run verified."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
              />

              {/* Quick Suggestion Chips */}
              <Text style={styles.suggestionTitle}>Quick Presets:</Text>
              <View style={styles.suggestionGrid}>
                {getQuickNoteSuggestions().map((sugg) => (
                  <TouchableOpacity
                    key={sugg}
                    style={styles.suggestionChip}
                    onPress={() => setOperatorNote(sugg)}
                  >
                    <Text style={styles.suggestionChipText}>{sugg}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalConfirmBtn,
                    targetStatus === 'ACTIVE' && { backgroundColor: COLORS.active },
                    targetStatus === 'MAINTENANCE' && { backgroundColor: COLORS.maintenance },
                    targetStatus === 'DOWN' && { backgroundColor: COLORS.primary },
                  ]}
                  onPress={handleConfirmStatusChange}
                >
                  <Text style={styles.modalConfirmText}>Save & Log Status</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  backBtnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  appBar: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Crimson Red Line
  },
  backButton: {
    padding: 4,
  },
  appBarCenter: {
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appBarSubtitle: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statusBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  statusBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBannerTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  statusBannerHeadline: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusBannerSubtext: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  identityCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  machineMainName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  machineDepartment: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  statusActionSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusActionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  statusButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusToggleBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  specCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginLeft: 6,
    flex: 1,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specItem: {
    width: '50%',
    marginBottom: 12,
    paddingRight: 8,
  },
  specLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  specValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  qrBadgeCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  qrBadgeInstruction: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 14,
  },
  qrObsidianWrapper: {
    backgroundColor: COLORS.secondary, // Dark Obsidian Frame
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#374151',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  cornerAccent: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: COLORS.primary, // Red corner accents
  },
  cornerTL: {
    top: 6,
    left: 6,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 6,
    right: 6,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 6,
    left: 6,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 6,
    right: 6,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  qrWhiteContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  qrTagStrip: {
    backgroundColor: COLORS.primary, // Kaynes Red Tag Strip
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qrTagStripText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  logCountBadge: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  noLogsText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  logItem: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingLeft: 12,
    marginBottom: 14,
    paddingVertical: 2,
  },
  logHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  logStatusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  logTimestamp: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  logOperator: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  logNotes: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 17,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  modalTargetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTargetLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginRight: 8,
    fontWeight: '600',
  },
  modalStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  modalStatusPillText: {
    fontSize: 12,
    fontWeight: '900',
  },
  modalInputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  modalTextInput: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  modalNotesInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  modalNotesInputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  suggestionTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 6,
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
    marginBottom: 6,
  },
  suggestionChipText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 18,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 2,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modalConfirmText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
