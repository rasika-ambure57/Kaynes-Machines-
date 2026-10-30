import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function HelpScreen({ navigation }) {
  const [selectedError, setSelectedError] = useState(null);

  const errorCodes = [
    {
      code: 'E-42',
      title: 'Ultrasonic Bath Frequency Fault',
      impact: 'Cleanroom Ultrasonic Cleaner shutdown',
      fix: 'Drain transducer fluid bath, remove sediment build-up, and recalibrate 40 kHz oscillation module.',
    },
    {
      code: 'E-18',
      title: 'Reflow Zone Thermal Profile Mismatch',
      impact: 'Nitrogen Reflow Oven temperature excursion > ±3°C',
      fix: 'Check Zone 4-7 thermocouple probes. Inspect SAC305 profile recipe and verify nitrogen flow pressure.',
    },
    {
      code: 'E-05',
      title: 'Feeder Pick-Up Vacuum Drop',
      impact: 'Pick & Place High-Speed Mounter feeder mispick',
      fix: 'Clean nozzle head 4 filter. Check pneumatic vacuum pressure sensor and re-zero component optical height.',
    },
    {
      code: 'E-99',
      title: '3D Optical Moire Distortion',
      impact: 'AOI Inspection station coplanarity false alarms',
      fix: 'Wipe Moire projection lens using isopropyl alcohol and lint-free ESD wipes. Run shadow calibration target.',
    },
    {
      code: 'E-12',
      title: 'Selective Wave Solder Dross Jam',
      impact: 'Through-Hole Soldering nozzle flow blockage',
      fix: 'De-dross solder pot, clean nitrogen shroud, and check lead-free solder bar feed level.',
    },
  ];

  const handleDialHotline = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

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
          <Text style={styles.appBarTitle}>Help & Floor SOPs</Text>
          <Text style={styles.appBarSubtitle}>Operator Support Center</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Step-by-Step Scanner Standard Operating Procedures */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color={COLORS.primary} />
            <Text style={styles.cardHeading}>CHASSIS QR SCANNER SOPS</Text>
          </View>
          <Text style={styles.sopIntro}>
            Follow IPC-A-610 electronics plant protocol when scanning machinery barcodes:
          </Text>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContentCol}>
              <Text style={styles.stepTitle}>Position & Distance</Text>
              <Text style={styles.stepDesc}>
                Hold the scanner 15 to 25 cm from the metal asset tag. Ensure adequate floor task lighting without direct laser glare.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContentCol}>
              <Text style={styles.stepTitle}>Align Within Crimson Reticle</Text>
              <Text style={styles.stepDesc}>
                Fit the 2D matrix inside the crimson viewfinder brackets. The laser line will automatically register the payload.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContentCol}>
              <Text style={styles.stepTitle}>Verify Chassis Tag ID</Text>
              <Text style={styles.stepDesc}>
                Confirm the loaded Machine Tag (e.g. KYN-SMT-001) exactly matches the etched physical nameplate before status override.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContentCol}>
              <Text style={styles.stepTitle}>Degraded Barcode Fallback</Text>
              <Text style={styles.stepDesc}>
                If camera is unavailable or the code is scratched, use the Manual Asset Tag Lookup on the Operator Console.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Machine Error Codes Guide */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="alert-decagram-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardHeading}>COMMON EMS ERROR CODES GUIDE</Text>
          </View>
          <Text style={styles.sopIntro}>
            Tap any error code below to inspect the standard corrective action:
          </Text>

          {errorCodes.map((err) => {
            const isExpanded = selectedError === err.code;
            return (
              <TouchableOpacity
                key={err.code}
                style={[styles.errorCodeCard, isExpanded && styles.errorCodeCardExpanded]}
                activeOpacity={0.8}
                onPress={() => setSelectedError(isExpanded ? null : err.code)}
              >
                <View style={styles.errorCardHeader}>
                  <View style={styles.errorCodeTag}>
                    <Text style={styles.errorCodeTagText}>{err.code}</Text>
                  </View>
                  <Text style={styles.errorTitle} numberOfLines={1}>
                    {err.title}
                  </Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </View>

                {isExpanded && (
                  <View style={styles.errorExpandedContent}>
                    <Text style={styles.errorImpact}>
                      <Text style={{ fontWeight: '700', color: COLORS.primary }}>Impact: </Text>
                      {err.impact}
                    </Text>
                    <View style={styles.fixBox}>
                      <Ionicons name="build-outline" size={14} color={COLORS.secondary} style={{ marginRight: 6 }} />
                      <Text style={styles.fixText}>
                        <Text style={{ fontWeight: '800' }}>SOP Fix: </Text>
                        {err.fix}
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 3: Emergency Plant Maintenance Contacts */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="phone-alert-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardHeading}>EMERGENCY PLANT CONTACTS</Text>
          </View>

          <TouchableOpacity
            style={styles.contactItem}
            activeOpacity={0.7}
            onPress={() => handleDialHotline('+918212584011')}
          >
            <View style={styles.contactIconBox}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfoCol}>
              <Text style={styles.contactRole}>Line Maintenance Supervisor</Text>
              <Text style={styles.contactName}>Vikram Nair (Ext. 4011)</Text>
              <Text style={styles.contactPhone}>+91 821-258-4011</Text>
            </View>
            <View style={styles.callBadge}>
              <Text style={styles.callBadgeText}>CALL</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            activeOpacity={0.7}
            onPress={() => handleDialHotline('+918212584025')}
          >
            <View style={[styles.contactIconBox, { backgroundColor: COLORS.active }]}>
              <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfoCol}>
              <Text style={styles.contactRole}>ESD & Cleanroom Safety Officer</Text>
              <Text style={styles.contactName}>Sunita Rao (Ext. 4025)</Text>
              <Text style={styles.contactPhone}>+91 821-258-4025</Text>
            </View>
            <View style={styles.callBadge}>
              <Text style={styles.callBadgeText}>CALL</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.contactItemNoAction}>
            <View style={[styles.contactIconBox, { backgroundColor: COLORS.cardDark }]}>
              <Ionicons name="headset" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.contactInfoCol}>
              <Text style={styles.contactRole}>Facility Operations Helpdesk</Text>
              <Text style={styles.contactName}>24/7 Central Control Room</Text>
              <Text style={styles.contactPhone}>Ext. 4400 • desk@kaynestechnology.net</Text>
            </View>
          </View>
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
    marginBottom: 8,
  },
  cardHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  sopIntro: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: COLORS.surfaceSubtle,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stepContentCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  errorCodeCard: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  errorCodeCardExpanded: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  errorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorCodeTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 10,
  },
  errorCodeTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  errorTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  errorExpandedContent: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  errorImpact: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  fixBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.2)',
  },
  fixText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  contactItemNoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfoCol: {
    flex: 1,
  },
  contactRole: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  contactName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  contactPhone: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 1,
  },
  callBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  callBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
