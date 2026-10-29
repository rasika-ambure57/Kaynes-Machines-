import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMachines } from '../../context/MachineContext';
import { COLORS } from '../../constants/theme';

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { machines, getMachineById } = useMachines();

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    const scannedText = data?.trim();
    const machine = getMachineById(scannedText);

    if (machine) {
      navigation.replace('MachineDetailScreen', { machineId: machine.id });
    } else {
      Alert.alert(
        'Asset Not Recognized',
        `Scanned payload "${scannedText}" does not correspond to an active asset in this plant.`,
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  // Simulate scanning for development / testing without a physical barcode
  const handleSimulateScan = (sampleId) => {
    handleBarcodeScanned({ data: sampleId });
  };

  const sampleMachines = machines.slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Camera Header in Obsidian Black with Crimson Accent */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.topBarTitleRow}>
          <Text style={styles.topBarTitle}>Scan Asset QR Code</Text>
          <View style={styles.topBarRedPill}>
            <Text style={styles.topBarRedPillText}>LASER</Text>
          </View>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Camera View or Permission Prompt */}
      {permission && permission.granted ? (
        <View style={styles.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          {/* Viewfinder Overlay with High-Tech Crimson Red Reticle & Laser */}
          <View style={styles.overlayContainer}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayCenterRow}>
              <View style={styles.overlaySide} />
              <View style={styles.reticle}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                {/* High-Tech Crimson Red Laser Beam */}
                <View style={styles.scanLaser} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <View style={styles.instructionPill}>
                <View style={styles.instructionDot} />
                <Text style={styles.instructionText}>
                  Align Kaynes asset QR tag within the crimson reticle
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="camera-off-outline" size={56} color={COLORS.primary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionSubtitle}>
            To scan machinery QR badges on the shop floor, please grant camera permissions.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Simulator / Test Tray for Quick Dev Testing in Obsidian Black */}
      <View style={styles.simTray}>
        <View style={styles.simTitleRow}>
          <View style={styles.simRedDot} />
          <Text style={styles.simTrayTitle}>DEV / FLOOR TEST SIMULATOR</Text>
        </View>
        <Text style={styles.simTraySubtitle}>Tap an asset tag to simulate optical laser scan:</Text>
        <View style={styles.simChipsRow}>
          {sampleMachines.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.simChip}
              onPress={() => handleSimulateScan(m.id)}
            >
              <Text style={styles.simChipText}>{m.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Kaynes Crimson Red Line
  },
  backBtn: {
    padding: 4,
  },
  topBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  topBarRedPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  topBarRedPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayCenterRow: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  reticle: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.4)', // Subtle Crimson Red frame
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 30, 42, 0.03)',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.primary, // Bold Crimson Red corners (#D91E2A)
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanLaser: {
    width: '92%',
    height: 3,
    backgroundColor: COLORS.primary, // Crimson Red Laser Beam
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 8,
    elevation: 8,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 24,
  },
  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.3)',
  },
  instructionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  permissionSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  permissionBtn: {
    backgroundColor: COLORS.primary, // Kaynes Red Button
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  simTray: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  simTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  simRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  simTrayTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#E5E7EB',
    letterSpacing: 0.8,
  },
  simTraySubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 8,
  },
  simChipsRow: {
    flexDirection: 'row',
  },
  simChip: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary, // Red border
    marginRight: 8,
  },
  simChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
