import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

// Screens for Tabs
import AdminDashboard from '../screens/admin/AdminDashboard';
import OperatorDashboard from '../screens/operator/OperatorDashboard';
import ActivityFeedScreen from '../screens/shared/ActivityFeedScreen';
import AddMachineScreen from '../screens/admin/AddMachineScreen';
import ProfileScreen from '../screens/drawer/ProfileScreen';

const Tab = createBottomTabNavigator();

// Dummy component for Center Scan Tab placeholder
function DummyComponent() {
  return null;
}

export default function TabNavigator({ navigation }) {
  const { user, isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary, // Kaynes Red (#D91E2A)
        tabBarInactiveTintColor: '#9CA3AF', // Muted slate grey
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. Home / Dashboard */}
      <Tab.Screen
        name="HomeTab"
        component={isAdmin ? AdminDashboard : OperatorDashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Activity / Logs Feed */}
      <Tab.Screen
        name="ActivityTab"
        component={ActivityFeedScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'pulse' : 'pulse-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Hero Center Scan QR Floating Button */}
      <Tab.Screen
        name="ScanQRTab"
        component={DummyComponent}
        options={{
          tabBarLabel: () => null, // Hidden label for hero button
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.heroButtonContainer}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('QRScannerScreen')}
            >
              <View style={styles.heroButton}>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      {/* 4. Add Asset (Admin) / Registry Search (Operator/Viewer) */}
      {isAdmin ? (
        <Tab.Screen
          name="AddAssetTab"
          component={AddMachineScreen}
          options={{
            tabBarLabel: 'Add Asset',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'add-circle' : 'add-circle-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="RegistryTab"
          component={AdminDashboard}
          options={{
            tabBarLabel: 'Registry',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
      )}

      {/* 5. Profile */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#111827', // Obsidian Black
    borderTopWidth: 1.5,
    borderTopColor: '#1F2937', // Dark Charcoal Border
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  heroButtonContainer: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  heroButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary, // Kaynes Red (#D91E2A)
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3.5,
    borderColor: '#111827', // Obsidian Black border ring
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
});
