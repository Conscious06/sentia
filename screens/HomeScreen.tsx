import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera" size={48} color="#2C3E50" />
        </View>
        <Text style={styles.title}>Cultural Lens</Text>
        <Text style={styles.subtitle}>
          Discover the stories behind landmarks, artworks, and historical sites
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>What would you like to explore?</Text>

        <TouchableOpacity
          style={[styles.card, styles.cameraCard]}
          onPress={() => navigation.navigate('Camera')}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="camera-outline" size={32} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Take a Photo</Text>
            <Text style={styles.cardDescription}>
              Capture a building, monument, or artwork with your camera
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.galleryCard]}
          onPress={() => navigation.navigate('Gallery')}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="images-outline" size={32} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Choose from Gallery</Text>
            <Text style={styles.cardDescription}>
              Select an existing photo from your device
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle-outline" size={24} color="#2C3E50" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoDescription}>
                Simply capture or select an image of any cultural site, landmark, or artwork.
                Our AI will analyze it and provide detailed historical and cultural context.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#2C3E50" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Reliable Information</Text>
              <Text style={styles.infoDescription}>
                We prioritize accuracy. When uncertain, we clearly indicate confidence levels
                and probability rather than guessing.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="book-outline" size={24} color="#2C3E50" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Rich Context</Text>
              <Text style={styles.infoDescription}>
                Get historical background, architectural details, fun facts, and visitor tips
                all in one place.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraCard: {
    backgroundColor: '#E74C3C',
  },
  galleryCard: {
    backgroundColor: '#3498DB',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoSection: {
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: '#7F8C8D',
    lineHeight: 18,
  },
});
