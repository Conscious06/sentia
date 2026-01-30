/**
 * SENTIA - Camera Screen
 *
 * Camera-first experience with minimal UI.
 * App opens directly here.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import locationService from '../../services/location';
import premiumService from '../../services/storage/premiumService';
import { COPY, UI_CONFIG } from '../../constants/config';

/**
 * Camera Screen Component
 *
 * Full-screen camera with minimal overlay.
 * Auto-captures or allows manual capture.
 */
export default function CameraScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef(null);

  // Request location permission silently
  useEffect(() => {
    locationService.checkPermission();
    premiumService.init();
  }, []);

  // Check camera permission
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          SENTIA needs camera access to analyze places, art, and architecture around you.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.libraryButton} onPress={openPicker}>
          <Text style={styles.libraryButtonText}>Choose from Library</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Capture photo from camera
   */
  const handleCapture = async () => {
    if (isAnalyzing || !cameraRef.current) return;

    setIsAnalyzing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: UI_CONFIG.camera.quality,
        skipProcessing: true,
      });

      // Get location for context
      const location = await locationService.getCachedLocation();

      // Navigate to analysis
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Analysis',
          params: { imageUri: photo.uri, location }
        }],
      });

    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Unable to capture photo. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Open image picker as alternative
   */
  const openPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: UI_CONFIG.camera.quality,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const location = await locationService.getCachedLocation();

        navigation.reset({
          index: 0,
          routes: [{
            name: 'Analysis',
            params: { imageUri: result.assets[0].uri, location }
          }],
        });
      }
    } catch (error) {
      console.error('Picker error:', error);
    }
  };

  /**
   * Toggle camera facing direction
   */
  const toggleFacing = () => {
    setFacing(current => current === 'back' ? 'front' : 'back');
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setIsReady(true)}
        active={true}
      />

      {/* Top overlay - guidance text */}
      <View style={styles.topOverlay}>
        <View style={styles.guidanceBox}>
          <Text style={styles.guidanceText}>{COPY.cameraGuidance}</Text>
        </View>
      </View>

      {/* Bottom overlay - capture controls */}
      <View style={styles.bottomOverlay}>
        {/* Library button */}
        <TouchableOpacity style={styles.sideButton} onPress={openPicker}>
          <View style={styles.libraryIcon}>
            <Text style={styles.libraryIconText}>□</Text>
          </View>
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity
          style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={isAnalyzing || !isReady}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        {/* Flip button */}
        <TouchableOpacity style={styles.sideButton} onPress={toggleFacing}>
          <View style={styles.flipIcon}>
            <Text style={styles.flipIconText}>⇄</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Analyzing indicator */}
      {isAnalyzing && (
        <View style={styles.analyzingOverlay}>
          <Text style={styles.analyzingText}>{COPY.analyzing}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  // Top overlay
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  guidanceBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  guidanceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  // Bottom overlay
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  libraryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  libraryIconText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '300',
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
  },
  flipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipIconText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '300',
  },
  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  libraryButton: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  libraryButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  // Analyzing overlay
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});
