// MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import JournalScreen from '../screens/JournalScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileStack from '../tabs/ProfileStack';

const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FDA2B1',
        tabBarInactiveTintColor: '#18024E',
    }}
  >
    <Tab.Screen
      name="Catatan"
      component={JournalScreen}
      options={{ tabBarIcon: ({ color }) => (<Icon name="notebook" color={color} size={24} />) }}
    />
    <Tab.Screen
      name="Jelajahi"
      component={ExploreScreen}
      options={{ tabBarIcon: ({ color }) => (<Icon name="map-marker" color={color} size={24} />) }}
    />
    <Tab.Screen
      name="Cari"
      component={SearchScreen}
      options={{ tabBarIcon: ({ color }) => (<Icon name="magnify" color={color} size={24} />) }}
    />
    <Tab.Screen
      name="Profil"
      component={ProfileStack}
      options={{ tabBarIcon: ({ color }) => (<Icon name="account" color={color} size={24} />) }}
    />
  </Tab.Navigator>
);

export default MainTabs;