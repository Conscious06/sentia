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
          <Ionicons name="images" size={70} color="#C7BBAA" />
        </View>

        <Text style={styles.title}>Choose an Image</Text>
        <Text style={styles.description}>
          Select a photo from your gallery to analyze cultural sites, landmarks, artworks, or historical objects.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C7BBAA" />
            <Text style={styles.loadingText}>Loading gallery...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="#F7F2E9" />
              <Text style={styles.buttonText}>Browse Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={22} color="#C7BBAA" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Take New Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#C7BBAA" />
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
    backgroundColor: '#0B0A09',
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 60,
    padding: 22,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#F7F2E9',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
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
    color: 'rgba(255, 255, 255, 0.6)',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: 'rgba(33, 28, 23, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(33, 28, 23, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#F7F2E9',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#C7BBAA',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 28, 23, 0.95)',
    padding: 15,
    borderRadius: 14,
    marginTop: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 10,
    lineHeight: 18,
  },
});
