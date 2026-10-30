import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useMachines } from '../../context/MachineContext';
import { COLORS, DEPARTMENTS } from '../../constants/theme';

export default function AdminDashboard({ navigation }) {
  const { user } = useAuth();
  const { machines } = useMachines();

  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered machine list
  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchesDept =
        selectedDepartment === 'All' || machine.department === selectedDepartment;
      const query = searchQuery.trim().toLowerCase();
      const modelStr = machine.model || machine.modelNumber || '';
      const serialStr = machine.serialNumber || '';
      const matchesSearch =
        !query ||
        machine.name.toLowerCase().includes(query) ||
        machine.id.toLowerCase().includes(query) ||
        modelStr.toLowerCase().includes(query) ||
        serialStr.toLowerCase().includes(query);
      return matchesDept && matchesSearch;
    });
  }, [machines, selectedDepartment, searchQuery]);

  const renderStatusBadge = (status) => {
    let bg = COLORS.activeBg;
    let text = COLORS.activeText;
    let border = COLORS.activeBorder;
    let dotColor = COLORS.active;

    if (status === 'MAINTENANCE') {
      bg = COLORS.maintenanceBg;
      text = COLORS.maintenanceText;
      border = COLORS.maintenanceBorder;
      dotColor = COLORS.maintenance;
    } else if (status === 'DOWN') {
      bg = COLORS.downBg;
      text = COLORS.downText;
      border = COLORS.downBorder;
      dotColor = COLORS.down;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bg, borderColor: border }]}>
        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.statusBadgeText, { color: text }]}>{status}</Text>
      </View>
    );
  };

  const renderMachineItem = ({ item }) => (
    <TouchableOpacity
      style={styles.machineCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MachineDetailScreen', { machineId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.tagWrapper}>
          <MaterialCommunityIcons name="qrcode" size={15} color={COLORS.primary} />
          <Text style={styles.tagText}>{item.id}</Text>
        </View>
        {renderStatusBadge(item.status)}
      </View>

      <Text style={styles.machineName}>{item.name}</Text>
      <Text style={styles.machineModel}>
        Model: <Text style={styles.modelHighlight}>{item.model || item.modelNumber}</Text> • SN: {item.serialNumber}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.departmentPill}>
          <MaterialCommunityIcons name="factory" size={12} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.departmentPillText}>{item.department}</Text>
        </View>

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceText}>
            Serviced: <Text style={{ fontWeight: '700', color: COLORS.textPrimary }}>{item.lastServiced}</Text>
          </Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} style={{ marginLeft: 6 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Top Bar Header in Obsidian Black with Crimson Accent */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topBarLeft}>
          <View style={styles.plantTitleRow}>
            <Text style={styles.plantTitle}>KAYNES</Text>
            <View style={styles.plantRedPill}>
              <Text style={styles.plantRedPillText}>ADMIN</Text>
            </View>
          </View>
          <View style={styles.userRoleRow}>
            <View style={styles.roleIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.roleIndicatorText}>{user?.role?.toUpperCase() || 'ADMIN'}</Text>
            </View>
            <Text style={styles.userNameText}>• {user?.name || 'Administrator'}</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Search Bar with Crisp Border */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, machine, model or SN..."
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

        {/* Department Filter Pills (Solid Kaynes Red Active State) */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDepartment === dept;
              const count =
                dept === 'All'
                  ? machines.length
                  : machines.filter((m) => m.department === dept).length;

              return (
                <TouchableOpacity
                  key={dept}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}
                  onPress={() => setSelectedDepartment(dept)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                    {dept}
                  </Text>
                  <View style={[styles.filterBadge, isSelected ? styles.filterBadgeActive : styles.filterBadgeInactive]}>
                    <Text style={[styles.filterBadgeText, isSelected && styles.filterBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Machine List */}
        <FlatList
          data={filteredMachines}
          keyExtractor={(item) => item.id}
          renderItem={renderMachineItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="robot-confused-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Machinery Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting the department filter or search criteria.
              </Text>
            </View>
          }
        />
      </View>

      {/* Floating Action Button (FAB) in Bold Kaynes Red */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddMachineScreen')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>Add Asset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Kaynes Crimson Red Line
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  menuButton: {
    marginRight: 12,
    padding: 2,
  },
  topBarLeft: {
    flex: 1,
  },
  plantTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  plantRedPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 8,
  },
  plantRedPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  userRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.active,
    marginRight: 5,
  },
  roleIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userNameText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  filterSection: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary, // Solid Kaynes Red
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  filterBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  filterBadgeInactive: {
    backgroundColor: COLORS.surfaceSubtle,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  machineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(217, 30, 42, 0.25)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  machineName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  machineModel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  modelHighlight: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  departmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  departmentPillText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: COLORS.primary, // Bold Kaynes Red
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
});
