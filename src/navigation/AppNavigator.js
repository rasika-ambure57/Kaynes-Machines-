import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

// Custom Drawer Component
import CustomDrawerContent from '../components/CustomDrawerContent';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import OperatorDashboard from '../screens/operator/OperatorDashboard';
import AddMachineScreen from '../screens/admin/AddMachineScreen';
import MachineDetailScreen from '../screens/shared/MachineDetailScreen';
import QRScannerScreen from '../screens/shared/QRScannerScreen';
import ProfileScreen from '../screens/drawer/ProfileScreen';
import HelpScreen from '../screens/drawer/HelpScreen';
import UserManagementScreen from '../screens/drawer/UserManagementScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Authenticated Drawer Navigator Shell
function MainDrawerNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        swipeEdgeWidth: 80,
        drawerStyle: {
          width: '84%',
          maxWidth: 360,
          backgroundColor: COLORS.background,
        },
        overlayColor: 'rgba(17, 24, 39, 0.7)', // Obsidian semi-transparent backdrop
      }}
    >
      {/* 1. Dashboard / Home Screen: Displays Admin or Operator Dashboard based on active role */}
      <Drawer.Screen
        name="Dashboard"
        component={isAdmin ? AdminDashboard : OperatorDashboard}
        options={{
          title: 'Dashboard / Home',
        }}
      />

      {/* 2. Profile Screen */}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />

      {/* 3. Help & Support Screen */}
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          title: 'Help & Support',
        }}
      />

      {/* 4. User Management Screen */}
      <Drawer.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{
          title: 'User Management',
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      key={user ? user.role : 'unauthenticated'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        // Auth Flow
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      ) : (
        // Authenticated Stack with Drawer Shell & Modal/Push Screens
        <Stack.Group>
          <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
          <Stack.Screen name="AddMachineScreen" component={AddMachineScreen} />
          <Stack.Screen name="MachineDetailScreen" component={MachineDetailScreen} />
          <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
