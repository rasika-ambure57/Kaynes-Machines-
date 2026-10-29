import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function LoginScreen() {
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const { login } = useAuth();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    login(role, userName);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Obsidian Black Header with Kaynes Crimson Red Accents */}
        <View style={styles.headerContainer}>
          <View style={styles.badgeContainer}>
            <View style={styles.redDot} />
            <Text style={styles.badgeText}>KAYNES TECHNOLOGY INDIA</Text>
          </View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitle}>KAYNES</Text>
            <View style={styles.brandRedPill}>
              <Text style={styles.brandRedPillText}>EMS</Text>
            </View>
          </View>
          <Text style={styles.brandSubtitle}>
            Precision Electronics Manufacturing Services • Shop Floor 4.0
          </Text>
          <View style={styles.redLineDivider} />
          <View style={styles.facilityRow}>
            <MaterialCommunityIcons name="factory" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.facilityText}>
              Mysuru Facility • SMT • Advanced Testing • Cleanroom Bay
            </Text>
          </View>
        </View>

        {/* Operator Identity Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>OPERATOR / ENGINEER IDENTITY</Text>
          <View
            style={[
              styles.inputWrapper,
              inputFocused && styles.inputWrapperFocused,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={inputFocused ? COLORS.primary : COLORS.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name (e.g., Rajesh Kumar)"
              placeholderTextColor={COLORS.textMuted}
              value={userName}
              onChangeText={setUserName}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoCapitalize="words"
              maxLength={40}
            />
            {userName.length > 0 && (
              <TouchableOpacity onPress={() => setUserName('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.inputHelper}>
            Optional. Defaults to designated corporate role if left blank.
          </Text>
        </View>

        {/* 3 One-Tap Role Selection Cards with Red Accents & Rings */}
        <View style={styles.rolesSection}>
          <Text style={styles.sectionHeader}>SELECT FLOOR ROLE TO ACCESS</Text>

          {/* Role 1: Plant Admin */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'admin' ? styles.roleCardActive : styles.roleCardAdminBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelectRole('admin')}
          >
            <View style={[styles.roleIconBox, { backgroundColor: COLORS.primaryLight }]}>
              <MaterialCommunityIcons name="shield-crown-outline" size={26} color={COLORS.primary} />
            </View>
            <View style={styles.roleContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleTitle}>Plant Admin</Text>
                <View style={styles.roleAdminTag}>
                  <Text style={styles.roleAdminTagText}>FULL ACCESS</Text>
                </View>
              </View>
              <Text style={styles.roleDescription}>
                Manage asset registry, generate live QR tags, configure plant lines, and view telemetry metrics.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Role 2: Floor Operator */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'operator' ? styles.roleCardActive : styles.roleCardOperatorBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelectRole('operator')}
          >
            <View style={[styles.roleIconBox, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="barcode-scan" size={26} color={COLORS.active} />
            </View>
            <View style={styles.roleContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleTitle}>Floor Operator</Text>
                <View style={styles.roleOperatorTag}>
                  <Text style={styles.roleOperatorTagText}>SHOP FLOOR</Text>
                </View>
              </View>
              <Text style={styles.roleDescription}>
                Scan machine QR codes on the line, toggle active/down states, and log instant maintenance notes.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {/* Role 3: Viewer */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'viewer' ? styles.roleCardActive : styles.roleCardViewerBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => handleSelectRole('viewer')}
          >
            <View style={[styles.roleIconBox, { backgroundColor: COLORS.surfaceSubtle }]}>
              <MaterialCommunityIcons name="eye-outline" size={26} color={COLORS.textSecondary} />
            </View>
            <View style={styles.roleContent}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleTitle}>Plant Viewer</Text>
                <View style={styles.roleViewerTag}>
                  <Text style={styles.roleViewerTagText}>READ ONLY</Text>
                </View>
              </View>
              <Text style={styles.roleDescription}>
                Inspect machine specs, read maintenance audit logs, and monitor plant health metrics without write access.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
          <Text style={styles.footerText}>Kaynes Technology Corporate Security • ISO 9001 / AS9100D Certified</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  headerContainer: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 26,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Kaynes Red Accent
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 30, 42, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
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
  badgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: COLORS.textLight,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandRedPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  brandRedPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
    lineHeight: 18,
  },
  redLineDivider: {
    height: 2,
    backgroundColor: 'rgba(217, 30, 42, 0.5)',
    marginVertical: 12,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityText: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputSection: {
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: COLORS.surface,
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
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  inputHelper: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  rolesSection: {
    marginHorizontal: 18,
    marginTop: 22,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleCardAdminBorder: {
    borderLeftColor: COLORS.primary, // Crimson Red focus accent
  },
  roleCardOperatorBorder: {
    borderLeftColor: COLORS.active,
  },
  roleCardViewerBorder: {
    borderLeftColor: COLORS.textSecondary,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    borderLeftColor: COLORS.primary,
    backgroundColor: '#FFF5F5',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  roleIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  roleContent: {
    flex: 1,
    marginRight: 8,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roleAdminTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.2)',
  },
  roleAdminTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  roleOperatorTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleOperatorTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  roleViewerTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleViewerTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#374151',
    letterSpacing: 0.5,
  },
  roleDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  footerNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
});
