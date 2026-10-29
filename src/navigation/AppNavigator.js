import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AddMachineScreen from '../screens/admin/AddMachineScreen';
import OperatorDashboard from '../screens/operator/OperatorDashboard';
import MachineDetailScreen from '../screens/shared/MachineDetailScreen';
import QRScannerScreen from '../screens/shared/QRScannerScreen';

const Stack = createNativeStackNavigator();

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
        // Auth Stack: Login / Role Selection Screen
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      ) : user.role === 'admin' ? (
        // Plant Admin Stack (AdminDashboard is 1st screen -> default initial route)
        <Stack.Group>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="AddMachineScreen" component={AddMachineScreen} />
          <Stack.Screen name="MachineDetailScreen" component={MachineDetailScreen} />
          <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
          <Stack.Screen name="OperatorDashboard" component={OperatorDashboard} />
        </Stack.Group>
      ) : (
        // Floor Operator & Viewer Stack (OperatorDashboard is 1st screen -> default initial route)
        <Stack.Group>
          <Stack.Screen name="OperatorDashboard" component={OperatorDashboard} />
          <Stack.Screen name="MachineDetailScreen" component={MachineDetailScreen} />
          <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="AddMachineScreen" component={AddMachineScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
