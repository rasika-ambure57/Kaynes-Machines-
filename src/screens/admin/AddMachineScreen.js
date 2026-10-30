import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MachineContext, useMachines } from '../../context/MachineContext';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

const DEPARTMENTS_LIST = [
  'SMT Lines',
  'Testing & Inspection',
  'Soldering & Assembly',
  'Cleanroom',
];

export default function AddMachineScreen({ navigation }) {
  const context = useContext(MachineContext);
  const { addMachine, generateNextTagId, machines } = context || useMachines();
  const { user } = useAuth();

  const [department, setDepartment] = useState('SMT Lines');
  const [tagId, setTagId] = useState('');
  const [name, setName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [lineBay, setLineBay] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate tag ID when department changes or machines list updates
  useEffect(() => {
    if (generateNextTagId) {
      const nextId = generateNextTagId(department);
      setTagId(nextId);
    }
  }, [department, machines?.length]);

  // Live QR payload: encodes the unique asset tag ID
  const qrValue = tagId || 'KYN-ASSET-PREVIEW';

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Machine name is required';
    }
    if (!modelNumber.trim()) {
      newErrors.modelNumber = 'Model number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!name.trim() || !modelNumber.trim()) {
      setErrors({
        name: !name.trim() ? 'Machine name is required' : null,
        modelNumber: !modelNumber.trim() ? 'Model number is required' : null,
      });
      Alert.alert(
        'Please fill in required fields',
        'Machine Name and Model Number are required before saving asset to registry.'
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await addMachine({
        id: tagId,
        name: name.trim(),
        modelNumber: modelNumber.trim(),
        model: modelNumber.trim(),
        serialNumber: serialNumber.trim() || `SN-${Date.now().toString().slice(-6)}`,
        department,
        status: status || 'ACTIVE',
        line: lineBay.trim() || `${department} - Station 1`,
        operatorName: user?.name || 'Plant Admin',
      });

      // Immediately return to AdminDashboard upon success
      navigation.goBack();
    } catch (err) {
      console.error('Registration failed:', err);
      Alert.alert('Registration Failed', 'Could not save asset to storage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Screen App Bar in Obsidian Black */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Register New Machine</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {/* Sleek Dark Obsidian QR Code Preview Frame with Red Corner Accents */}
        <View style={styles.qrObsidianFrame}>
          {/* Red Corner Accents */}
          <View style={[styles.cornerAccent, styles.cornerTL]} />
          <View style={[styles.cornerAccent, styles.cornerTR]} />
          <View style={[styles.cornerAccent, styles.cornerBL]} />
          <View style={[styles.cornerAccent, styles.cornerBR]} />

          <View style={styles.qrBadgeHeader}>
            <View style={styles.liveRedDot} />
            <Text style={styles.qrBadgeHeaderText}>LIVE ASSET TAG & QR CODE</Text>
          </View>

          <View style={styles.qrCodeContainer}>
            <QRCode
              value={qrValue}
              size={130}
              color={COLORS.secondary}
              backgroundColor="#FFFFFF"
            />
          </View>

          <Text style={styles.qrAssetTagText}>{tagId}</Text>
          <Text style={styles.qrAssetNamePreview} numberOfLines={1}>
            {name.trim() || 'Machine Name Preview'}
          </Text>
          <Text style={styles.qrDepartmentPreview}>
            {department} • Status: <Text style={{ color: COLORS.primaryLight, fontWeight: '700' }}>{status}</Text>
          </Text>
        </View>

        {/* Form Fields Section */}
        <View style={styles.formContainer}>
          {/* Department Selector */}
          <Text style={styles.inputLabel}>EMS DEPARTMENT / PROCESS *</Text>
          <View style={styles.departmentGrid}>
            {DEPARTMENTS_LIST.map((dept) => {
              const isSelected = department === dept;
              return (
                <TouchableOpacity
                  key={dept}
                  style={[styles.deptChip, isSelected && styles.deptChipActive]}
                  onPress={() => setDepartment(dept)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.deptChipText, isSelected && styles.deptChipTextActive]}>
                    {dept}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Generated Asset Tag ID */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>UNIQUE ASSET TAG ID</Text>
            <View style={[styles.inputWrapper, styles.readOnlyInput]}>
              <MaterialCommunityIcons name="barcode" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { fontWeight: '800', color: COLORS.primary }]}
                value={tagId}
                onChangeText={setTagId}
                autoCapitalize="characters"
                editable={true}
                pointerEvents="auto"
              />
              <View style={styles.tagHintPill}>
                <Text style={styles.tagHint}>Auto</Text>
              </View>
            </View>
          </View>

          {/* Machine Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>MACHINE / EQUIPMENT NAME *</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'name' && styles.inputWrapperFocused,
                errors.name && styles.inputErrorBorder,
              ]}
            >
              <MaterialCommunityIcons
                name="cog-outline"
                size={20}
                color={focusedField === 'name' ? COLORS.primary : COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Yamaha YSM20R Pick & Place"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                editable={true}
                pointerEvents="auto"
                autoCapitalize="words"
                autoCorrect={false}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                onChangeText={(val) => {
                  setName(val);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Model Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>MODEL NUMBER / REVISION *</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'modelNumber' && styles.inputWrapperFocused,
                errors.modelNumber && styles.inputErrorBorder,
              ]}
            >
              <MaterialCommunityIcons
                name="tools"
                size={20}
                color={focusedField === 'modelNumber' ? COLORS.primary : COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g., YSM20R-Dual-Beam"
                placeholderTextColor={COLORS.textMuted}
                value={modelNumber}
                editable={true}
                pointerEvents="auto"
                autoCapitalize="characters"
                autoCorrect={false}
                onFocus={() => setFocusedField('modelNumber')}
                onBlur={() => setFocusedField(null)}
                onChangeText={(val) => {
                  setModelNumber(val);
                  if (errors.modelNumber) setErrors((prev) => ({ ...prev, modelNumber: null }));
                }}
              />
            </View>
            {errors.modelNumber && <Text style={styles.errorText}>{errors.modelNumber}</Text>}
          </View>

          {/* Serial Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>HARDWARE SERIAL NUMBER (SN)</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'sn' && styles.inputWrapperFocused,
              ]}
            >
              <MaterialCommunityIcons
                name="numeric"
                size={20}
                color={focusedField === 'sn' ? COLORS.primary : COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g., YMH-2026-9041 (leave blank for auto)"
                placeholderTextColor={COLORS.textMuted}
                value={serialNumber}
                editable={true}
                pointerEvents="auto"
                autoCapitalize="characters"
                autoCorrect={false}
                onFocus={() => setFocusedField('sn')}
                onBlur={() => setFocusedField(null)}
                onChangeText={setSerialNumber}
              />
            </View>
          </View>

          {/* Line / Bay Location */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>FLOOR LOCATION / BAY</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'bay' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={focusedField === 'bay' ? COLORS.primary : COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g., SMT Line 2 - Bay A"
                placeholderTextColor={COLORS.textMuted}
                value={lineBay}
                editable={true}
                pointerEvents="auto"
                autoCapitalize="words"
                autoCorrect={false}
                onFocus={() => setFocusedField('bay')}
                onBlur={() => setFocusedField(null)}
                onChangeText={setLineBay}
              />
            </View>
          </View>

          {/* Initial Operational Status */}
          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>INITIAL OPERATING STATUS</Text>
            <View style={styles.statusToggleRow}>
              {['ACTIVE', 'MAINTENANCE', 'DOWN'].map((st) => {
                const isSelected = status === st;
                let activeColor = COLORS.active;
                let activeBg = COLORS.activeBg;
                if (st === 'MAINTENANCE') {
                  activeColor = COLORS.maintenance;
                  activeBg = COLORS.maintenanceBg;
                } else if (st === 'DOWN') {
                  activeColor = COLORS.primary;
                  activeBg = COLORS.primaryLight;
                }

                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.statusToggleBtn,
                      isSelected && {
                        backgroundColor: activeBg,
                        borderColor: activeColor,
                      },
                    ]}
                    onPress={() => setStatus(st)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.statusToggleDot,
                        { backgroundColor: isSelected ? activeColor : COLORS.textMuted },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusToggleText,
                        isSelected && { color: activeColor, fontWeight: '800' },
                      ]}
                    >
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button in Solid Kaynes Red */}
          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload-outline" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Registering...' : 'Save Asset to Registry'}
            </Text>
          </TouchableOpacity>
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
  appBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  qrObsidianFrame: {
    backgroundColor: COLORS.secondary, // Sleek Obsidian Black Frame
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cornerAccent: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: COLORS.primary, // Kaynes Red corner accents
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  qrBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  qrBadgeHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E5E7EB',
    letterSpacing: 1,
  },
  qrCodeContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  qrAssetTagText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  qrAssetNamePreview: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '600',
    marginTop: 2,
  },
  qrDepartmentPreview: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    zIndex: 1,
    position: 'relative',
    elevation: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  deptChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  deptChipActive: {
    backgroundColor: COLORS.primary, // Solid Kaynes Red
    borderColor: COLORS.primary,
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  deptChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  fieldGroup: {
    marginBottom: 16,
    zIndex: 1,
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 48,
    height: 48,
    zIndex: 1,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary, // Kaynes Red active border
    backgroundColor: '#FFFFFF',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  readOnlyInput: {
    backgroundColor: COLORS.primaryLight,
    borderColor: 'rgba(217, 30, 42, 0.25)',
  },
  inputIcon: {
    marginRight: 10,
    pointerEvents: 'none',
  },
  textInput: {
    flex: 1,
    minHeight: 48,
    height: 48,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    zIndex: 1,
    paddingVertical: 0,
  },
  tagHintPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagHint: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  inputErrorBorder: {
    borderColor: COLORS.primary,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '700',
  },
  statusToggleRow: {
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
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  statusToggleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary, // Solid Kaynes Red
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
