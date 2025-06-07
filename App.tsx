/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabs from './src/tabs/MainTabs';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import notifee from '@notifee/react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

function App(): React.JSX.Element {
    const safePadding = '5%';

    useEffect(() => {
      async function setup() {
        await notifee.requestPermission();
      }
      setup();
    }, []);

    return (
        <NavigationContainer>
              <Stack.Navigator
                initialRouteName="AuthLoading"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Main" component={MainTabs} />
              </Stack.Navigator>
            </NavigationContainer>
      );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
