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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera" size={42} color="#E6DCCF" />
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
            <Ionicons name="camera-outline" size={28} color="#EDE4D7" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Take a Photo</Text>
            <Text style={styles.cardDescription}>
              Capture a building, monument, or artwork with your camera
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="#EDE4D7" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.galleryCard]}
          onPress={() => navigation.navigate('Gallery')}
        >
          <View style={styles.cardIconContainer}>
            <Ionicons name="images-outline" size={28} color="#EDE4D7" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Choose from Gallery</Text>
            <Text style={styles.cardDescription}>
              Select an existing photo from your device
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="#EDE4D7" />
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle-outline" size={20} color="#C7BBAA" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoDescription}>
                Simply capture or select an image of any cultural site, landmark, or artwork.
                Our AI will analyze it and provide detailed historical and cultural context.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#C7BBAA" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Reliable Information</Text>
              <Text style={styles.infoDescription}>
                We prioritize accuracy. When uncertain, we clearly indicate confidence levels
                and probability rather than guessing.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="book-outline" size={20} color="#C7BBAA" />
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
    backgroundColor: '#0B0A09',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#14110F',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 40,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F7F2E9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(33, 28, 23, 0.95)',
  },
  cameraCard: {
    backgroundColor: 'rgba(62, 33, 30, 0.95)',
  },
  galleryCard: {
    backgroundColor: 'rgba(34, 47, 68, 0.95)',
  },
  cardIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F2E9',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoSection: {
    marginTop: 20,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 28, 23, 0.95)',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7F2E9',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
});
