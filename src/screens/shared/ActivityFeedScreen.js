import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMachines } from '../../context/MachineContext';
import { COLORS } from '../../constants/theme';

const FILTER_TYPES = ['All', 'MAINTENANCE', 'DOWN', 'ACTIVE'];

export default function ActivityFeedScreen({ navigation }) {
  const { machines } = useMachines();
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Aggregate all logs from all machines into a single timeline feed
  const allActivities = useMemo(() => {
    const list = [];
    (machines || []).forEach((m) => {
      if (Array.isArray(m.logs)) {
        m.logs.forEach((log) => {
          list.push({
            ...log,
            machineId: m.id,
            machineName: m.name,
            machineModel: m.model || m.modelNumber,
            department: m.department,
            line: m.line,
          });
        });
      }
    });

    // Sort by id or timestamp descending (most recent first)
    return list.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
  }, [machines]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (selectedFilter === 'All') return allActivities;
    return allActivities.filter((item) => item.statusChange === selectedFilter);
  }, [allActivities, selectedFilter]);

  const renderBadge = (status) => {
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
        <Text style={[styles.statusBadgeText, { color: text }]}>{status || 'EVENT'}</Text>
      </View>
    );
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.activityCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MachineDetailScreen', { machineId: item.machineId })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.machineTagRow}>
          <MaterialCommunityIcons name="qrcode" size={14} color={COLORS.primary} />
          <Text style={styles.machineTagText}>{item.machineId}</Text>
          <Text style={styles.departmentText}>• {item.department}</Text>
        </View>
        {renderBadge(item.statusChange)}
      </View>

      <Text style={styles.machineNameText} numberOfLines={1}>
        {item.machineName}
      </Text>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>{item.actionNotes || 'Operation recorded in plant registry.'}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.operatorRow}>
          <Ionicons name="person-circle-outline" size={16} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.operatorText}>{item.operatorName || 'Shop Floor Personnel'}</Text>
        </View>
        <View style={styles.timestampRow}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.timestampText}>{item.timestamp || 'Recent'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />

      {/* Top Bar Header in Obsidian Black */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer && navigation.openDrawer()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <View style={styles.brandRow}>
            <Text style={styles.brandTitle}>KAYNES</Text>
            <View style={styles.brandRedPill}>
              <Text style={styles.brandRedPillText}>AUDIT</Text>
            </View>
          </View>
          <Text style={styles.subTitle}>Plant Activity & Maintenance Log</Text>
        </View>

        <View style={styles.activityCounterPill}>
          <Text style={styles.activityCounterText}>{allActivities.length} Logs</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TYPES.map((filter) => {
            const isSelected = selectedFilter === filter;
            const count =
              filter === 'All'
                ? allActivities.length
                : allActivities.filter((a) => a.statusChange === filter).length;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {filter}
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

      {/* Activity List */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item, index) => item.id || `activity-${index}`}
        renderItem={renderActivityItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-clock-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Activity Logs Found</Text>
            <Text style={styles.emptySubtitle}>
              No plant status events match the selected filter.
            </Text>
          </View>
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
  topBar: {
    backgroundColor: COLORS.secondary, // Obsidian Black
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary, // Crimson Red Line
  },
  menuButton: {
    marginRight: 12,
    padding: 2,
  },
  topBarCenter: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  brandRedPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 8,
  },
  brandRedPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subTitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  activityCounterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activityCounterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  filterSection: {
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
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
    paddingBottom: 100,
  },
  activityCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  machineTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  machineTagText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    marginLeft: 4,
  },
  departmentText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
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
  machineNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  noteBox: {
    backgroundColor: COLORS.surfaceSubtle,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  operatorText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
});
