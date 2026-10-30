import React, { useState, useMemo } from 'react';
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
import { COLORS } from '../../constants/theme';

const MOCK_USERS = [
  {
    id: 'KYN-EMP-101',
    name: 'Rajesh Sharma',
    role: 'ADMIN',
    title: 'Lead Plant Administrator',
    assignedZone: 'Plant-Wide Supervisory Bay',
    status: 'ACTIVE',
    phone: '+91 821-258-4001',
    shift: 'Shift A',
  },
  {
    id: 'KYN-EMP-102',
    name: 'Amit Patel',
    role: 'OPERATOR',
    title: 'Senior SMT Line Technician',
    assignedZone: 'SMT Line 1 - Bay A',
    status: 'ACTIVE',
    phone: '+91 821-258-4002',
    shift: 'Shift A',
  },
  {
    id: 'KYN-EMP-103',
    name: 'Vikram Nair',
    role: 'OPERATOR',
    title: 'Reflow Oven & Thermal Specialist',
    assignedZone: 'SMT Line 1 - Bay B',
    status: 'ON SHIFT',
    phone: '+91 821-258-4003',
    shift: 'Shift A',
  },
  {
    id: 'KYN-EMP-104',
    name: 'Kavita Deshmukh',
    role: 'OPERATOR',
    title: 'Selective Wave Solder Operator',
    assignedZone: 'Through-Hole Bay 3',
    status: 'ACTIVE',
    phone: '+91 821-258-4004',
    shift: 'Shift B',
  },
  {
    id: 'KYN-EMP-105',
    name: 'Madhusudan Rao',
    role: 'OPERATOR',
    title: '3D AOI & X-Ray Quality Lead',
    assignedZone: 'Quality Gate 1',
    status: 'IN AUDIT',
    phone: '+91 821-258-4005',
    shift: 'Shift A',
  },
  {
    id: 'KYN-EMP-106',
    name: 'Suresh Iyer',
    role: 'OPERATOR',
    title: 'Cleanroom Ultrasonic Tech',
    assignedZone: 'Cleanroom ISO-7 Bay',
    status: 'MAINTENANCE',
    phone: '+91 821-258-4006',
    shift: 'Shift A',
  },
  {
    id: 'KYN-EMP-107',
    name: 'Pooja Kulkarni',
    role: 'VIEWER',
    title: 'Supply Chain & Inventory Auditor',
    assignedZone: 'Central Materials Bay',
    status: 'ACTIVE',
    phone: '+91 821-258-4007',
    shift: 'General',
  },
];

export default function UserManagementScreen({ navigation }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((item) => {
      const matchRole =
        selectedRoleFilter === 'ALL' || item.role === selectedRoleFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.assignedZone.toLowerCase().includes(q);
      return matchRole && matchQuery;
    });
  }, [searchQuery, selectedRoleFilter]);

  const handleUserPress = (item) => {
    if (!isAdmin) {
      Alert.alert(
        'Read-Only Directory',
        'Viewing personnel directory with restricted credentials. Modifying line assignments requires Plant Administrator credentials.'
      );
      return;
    }

    Alert.alert(
      item.name,
      `ID: ${item.id}\nRole: ${item.role}\nTitle: ${item.title}\nAssigned Zone: ${item.assignedZone}\nShift: ${item.shift}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Reassign Zone',
          onPress: () => {
            Alert.alert('Zone Reassignment', `Operator ${item.name} reassigned to current floor shift.`);
          },
        },
      ]
    );
  };

  const renderStatusTag = (status) => {
    let bg = '#ECFDF5';
    let text = '#065F46';
    let border = '#A7F3D0';

    if (status === 'IN AUDIT') {
      bg = '#FFFBEB';
      text = '#92400E';
      border = '#FDE68A';
    } else if (status === 'MAINTENANCE') {
      bg = COLORS.primaryLight;
      text = COLORS.primary;
      border = '#FECACA';
    }

    return (
      <View style={[styles.statusTag, { backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.statusTagText, { color: text }]}>{status}</Text>
      </View>
    );
  };

  const renderRolePill = (role) => {
    let bg = COLORS.surfaceSubtle;
    let color = COLORS.textSecondary;
    if (role === 'ADMIN') {
      bg = COLORS.primaryLight;
      color = COLORS.primary;
    } else if (role === 'OPERATOR') {
      bg = '#D1FAE5';
      color = '#065F46';
    }

    return (
      <View style={[styles.rolePill, { backgroundColor: bg }]}>
        <Text style={[styles.rolePillText, { color }]}>{role}</Text>
      </View>
    );
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      activeOpacity={0.7}
      onPress={() => handleUserPress(item)}
    >
      <View style={styles.userCardTop}>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarInitial}>
            {item.name.charAt(0)}
          </Text>
        </View>

        <View style={styles.userMainCol}>
          <View style={styles.userNameRow}>
            <Text style={styles.userNameText}>{item.name}</Text>
            {renderRolePill(item.role)}
          </View>
          <Text style={styles.userTitleText}>{item.title}</Text>
        </View>
      </View>

      <View style={styles.userCardDivider} />

      <View style={styles.userCardBottom}>
        <View style={styles.zoneRow}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.zoneText}>{item.assignedZone}</Text>
        </View>

        <View style={styles.bottomRightWrap}>
          <Text style={styles.shiftText}>{item.shift}</Text>
          {renderStatusTag(item.status)}
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.appBarTitle}>User Management</Text>
          <Text style={styles.appBarSubtitle}>Shop Floor Directory</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Non-Admin Read-Only Notice Banner */}
            {!isAdmin && (
              <View style={styles.readOnlyBanner}>
                <Ionicons name="lock-closed" size={18} color="#92400E" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.readOnlyBannerTitle}>READ-ONLY ACCESS NOTICE</Text>
                  <Text style={styles.readOnlyBannerDesc}>
                    You are viewing the plant personnel directory with restricted credentials. Modifying line assignments or personnel privileges requires Plant Administrator access.
                  </Text>
                </View>
              </View>
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, ID, role or assigned zone..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Role Filter Chips */}
            <View style={styles.filterRow}>
              {['ALL', 'ADMIN', 'OPERATOR', 'VIEWER'].map((rf) => {
                const isSelected = selectedRoleFilter === rf;
                return (
                  <TouchableOpacity
                    key={rf}
                    style={[styles.filterChip, isSelected && styles.filterChipActive]}
                    onPress={() => setSelectedRoleFilter(rf)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                      {rf}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionHeading}>REGISTERED FLOOR PERSONNEL</Text>
              <Text style={styles.personnelCount}>{filteredUsers.length} Found</Text>
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  readOnlyBannerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  readOnlyBannerDesc: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  personnelCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  userCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  userMainCol: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  rolePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rolePillText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  userTitleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userCardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  userCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bottomRightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginRight: 8,
  },
  statusTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
