import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import COLORS from '../constants/colors';
import { getUser } from '../services/storage';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MatkulScreen from '../screens/MatkulScreen';
import DetailMatkulScreen from '../screens/DetailMatkulScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoadingSpinner from '../components/LoadingSpinner';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icons = {
            Beranda: focused ? '[B]' : '[ ]',
            Matkul: focused ? '[M]' : '[ ]',
            Progres: focused ? '[P]' : '[ ]',
            Profil: focused ? '[U]' : '[ ]',
          };
          return (
            <Text style={{ fontSize: 16, color: focused ? COLORS.primary : COLORS.textLight }}>
              {icons[route.name] || '[ ]'}
            </Text>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Matkul" component={MatkulScreen} options={{ title: 'Mata Kuliah' }} />
      <Tab.Screen name="Progres" component={ProgressScreen} options={{ title: 'Progres' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const user = await getUser();
      setIsLoggedIn(!!user);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return <LoadingSpinner message="Memuat aplikasi..." />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'MainTabs' : 'Login'}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="DetailMatkul"
        component={DetailMatkulScreen}
        options={({ route }) => ({
          title: route.params?.matkul?.nama || 'Detail Mata Kuliah',
        })}
      />
    </Stack.Navigator>
  );
}
