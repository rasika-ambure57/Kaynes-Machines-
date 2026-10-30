import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_MACHINES } from '../utils/seedData';

const MACHINES_STORAGE_KEY = '@pat_machines_data_v1';

export const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from AsyncStorage or initialize with seed data
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const stored = await AsyncStorage.getItem(MACHINES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMachines(parsed);
            setIsLoading(false);
            return;
          }
        }
        // First run: save seed data
        await AsyncStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(INITIAL_MACHINES));
        setMachines(INITIAL_MACHINES);
      } catch (e) {
        console.warn('Failed to load machine data from AsyncStorage:', e);
        setMachines(INITIAL_MACHINES);
      } finally {
        setIsLoading(false);
      }
    };

    loadMachines();
  }, []);

  const persistMachines = async (updatedMachines) => {
    setMachines(updatedMachines);
    try {
      await AsyncStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(updatedMachines));
    } catch (e) {
      console.warn('Failed to persist machine data:', e);
    }
  };

  // Helper to generate next unique tag ID
  const generateNextTagId = (department) => {
    let prefix = 'SMT';
    if (department === 'Testing & Inspection') prefix = 'TST';
    else if (department === 'Soldering & Assembly') prefix = 'SLD';
    else if (department === 'Cleanroom') prefix = 'CLN';

    const regex = new RegExp(`^KYN-${prefix}-(\\d+)`);
    let maxNum = 0;
    (machines || []).forEach((m) => {
      if (m && m.id) {
        const match = m.id.match(regex);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      }
    });

    const nextNum = maxNum > 0 ? maxNum + 1 : ((machines || []).filter((m) => m && m.id && m.id.startsWith(`KYN-${prefix}`)).length + 1);
    const padded = String(nextNum).padStart(3, '0');
    return `KYN-${prefix}-${padded}`;
  };

  // Add new machine
  const addMachine = async (newMachineData) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const resolvedModel = (newMachineData.modelNumber || newMachineData.model || '').trim();
    const resolvedName = (newMachineData.name || '').trim();
    const resolvedDept = newMachineData.department || 'SMT Lines';

    let newId = newMachineData.id?.trim();
    if (!newId || (machines && machines.some((m) => m && m.id === newId))) {
      newId = generateNextTagId(resolvedDept);
    }

    const newMachine = {
      id: newId,
      name: resolvedName,
      model: resolvedModel,
      modelNumber: resolvedModel,
      serialNumber: newMachineData.serialNumber?.trim() || `SN-${Date.now().toString().slice(-6)}`,
      department: resolvedDept,
      status: newMachineData.status || 'ACTIVE',
      installDate: newMachineData.installDate || dateStr,
      lastServiced: dateStr,
      line: newMachineData.line?.trim() || `${resolvedDept} - Bay 1`,
      logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: `${dateStr} ${timeStr}`,
          operatorName: newMachineData.operatorName || 'Plant Admin',
          statusChange: newMachineData.status || 'ACTIVE',
          actionNotes: 'Asset commissioned and registered into Plant Asset Tracker system.',
        },
      ],
    };

    let updatedList;
    setMachines((prev) => {
      updatedList = [newMachine, ...(prev || [])];
      return updatedList;
    });

    try {
      await AsyncStorage.setItem(MACHINES_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to persist machine data:', e);
    }

    return newMachine;
  };

  // Update status and append maintenance history log
  const updateMachineStatus = async (machineId, newStatus, actionNotes, operatorName = 'Operator') => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = machines.map((machine) => {
      if (machine.id === machineId) {
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: `${dateStr} ${timeStr}`,
          operatorName: operatorName || 'Floor Operator',
          statusChange: newStatus,
          actionNotes: actionNotes?.trim() || `Status updated to ${newStatus}`,
        };

        return {
          ...machine,
          status: newStatus,
          lastServiced: dateStr,
          logs: [newLog, ...(machine.logs || [])],
        };
      }
      return machine;
    });

    await persistMachines(updated);
  };

  const getMachineById = (id) => {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    return machines.find(
      (m) =>
        (m.id && m.id.toUpperCase() === cleanId) ||
        (m.serialNumber && m.serialNumber.toUpperCase() === cleanId)
    ) || null;
  };

  const resetToSeed = async () => {
    await persistMachines(INITIAL_MACHINES);
  };

  return (
    <MachineContext.Provider
      value={{
        machines,
        isLoading,
        addMachine,
        updateMachineStatus,
        getMachineById,
        generateNextTagId,
        resetToSeed,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachines must be used within a MachineProvider');
  }
  return context;
};
