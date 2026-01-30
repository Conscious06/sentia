import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, CulturalAnalysis } from '../App';

type GalleryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Gallery'>;
};

export default function GalleryScreen({ navigation }: GalleryScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;

        navigation.navigate('Results', {
          imageUrl: imageUri,
          analysis: {
            title: 'Analyzing...',
            confidence: 'Processing',
            one_liner: 'Please wait while we analyze your image.',
            overview: 'This may take a few seconds.',
            history: '',
            architecture_or_art: '',
            fun_fact: '',
            visitor_tip: '',
            audio_ready_summary: '',
          },
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="images" size={80} color="#3498DB" />
        </View>

        <Text style={styles.title}>Choose an Image</Text>
        <Text style={styles.description}>
          Select a photo from your gallery to analyze cultural sites, landmarks, artworks, or historical objects.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498DB" />
            <Text style={styles.loadingText}>Loading gallery...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Browse Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color="#3498DB" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Take New Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#7F8C8D" />
          <Text style={styles.infoText}>
            The app analyzes buildings, monuments, artworks, and culturally significant objects.
            For best results, use clear, well-lit photos.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: '#EBF5FB',
    borderRadius: 60,
    padding: 25,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    fontSize: 15,
    color: '#7F8C8D',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3498DB',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#3498DB',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#E5E8E8',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 10,
    lineHeight: 18,
  },
});
