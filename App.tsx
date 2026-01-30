import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import ResultsScreen from './screens/ResultsScreen';
import GalleryScreen from './screens/GalleryScreen';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Gallery: undefined;
  Results: {
    imageUrl: string;
    analysis: CulturalAnalysis;
  };
};

export interface CulturalAnalysis {
  title: string;
  confidence: string;
  one_liner: string;
  overview: string;
  history: string;
  architecture_or_art: string;
  fun_fact: string;
  visitor_tip: string;
  audio_ready_summary: string;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2C3E50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Cultural Lens' }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: 'Capture Image' }}
          />
          <Stack.Screen
            name="Gallery"
            component={GalleryScreen}
            options={{ title: 'Select from Gallery' }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{ title: 'Analysis Results' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
