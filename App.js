/**
 * SENTIA - Main App Entry
 *
 * AI-powered cultural exploration app.
 * Camera-first, audio-first walking companion.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CameraScreen, AnalysisScreen } from './src/components';
import { StatusBar } from 'expo-status-bar';

/**
 * Stack navigator
 */
const Stack = createStackNavigator();

/**
 * Navigation theme (dark)
 */
const navTheme = {
  dark: true,
  colors: {
    primary: '#FFF',
    background: '#0D0D0D',
    card: '#0D0D0D',
    text: '#FFF',
    border: '#1A1A1A',
    notification: '#FFD700',
  },
};

/**
 * Main App Component
 */
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName="Camera"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0D0D0D' },
            gestureEnabled: true,
            gestureDirection: 'vertical',
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 300 } },
              close: { animation: 'timing', config: { duration: 300 } },
            },
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Analysis"
            component={AnalysisScreen}
            options={{ gestureEnabled: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
