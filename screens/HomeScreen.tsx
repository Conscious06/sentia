import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
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
      <View style={styles.hero}>
        <View style={styles.glowCircle} />
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Ionicons name="eye-outline" size={18} color="#93A6C3" />
          </View>
          <Text style={styles.brandLabel}>SENTIA</Text>
        </View>
        <Text style={styles.heroTitle}>See the{'\n'}meaning</Text>
        <Text style={styles.heroSubtitle}>
          Point your camera at any place, building, or artwork. I&apos;ll tell you what
          you&apos;re seeing — and why it matters.
        </Text>
      </View>

      <View style={styles.cardShell}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Begin perceiving</Text>
            <Text style={styles.cardSubtitle}>Open camera to explore</Text>
          </View>
          <TouchableOpacity
            style={styles.cardAction}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="eye-outline" size={20} color="#8DA4C5" />
          </TouchableOpacity>
        </View>
        <View style={styles.pillRow}>
          {['Architecture', 'Art', 'Culture', 'History'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionRow}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="time-outline" size={16} color="#7E7469" />
          <Text style={styles.sectionTitle}>Recent</Text>
        </View>
        <Text style={styles.sectionMeta}>2 discoveries</Text>
      </View>

      <View style={styles.recentRow}>
        <ImageBackground
          style={styles.recentCard}
          imageStyle={styles.recentImage}
          source={{
            uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
          }}
        >
          <View style={styles.recentBadge}>
            <Ionicons name="trash-outline" size={14} color="#C8BBAA" />
          </View>
          <View style={styles.recentOverlay}>
            <Text style={styles.recentTitle}>Self-Portrait with Bandaged Ear</Text>
            <Text style={styles.recentDescription}>
              A key modern self-portrait that embodies Vincent van Gogh&apos;s emotional
              intensity.
            </Text>
            <Text style={styles.recentMeta}>Today</Text>
          </View>
        </ImageBackground>
        <ImageBackground
          style={styles.recentCard}
          imageStyle={styles.recentImage}
          source={{
            uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
          }}
        >
          <View style={styles.recentOverlay}>
            <Text style={styles.recentTitle}>Dolmabahçe area</Text>
            <Text style={styles.recentDescription}>
              This looks like the edge of the imperial palace grounds in Istanbul.
            </Text>
            <Text style={styles.recentMeta}>Today</Text>
          </View>
        </ImageBackground>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Ionicons name="eye-outline" size={18} color="#9DB2D1" />
        <Text style={styles.primaryButtonText}>Open Camera</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>How Sentia perceives</Text>
      <View style={styles.infoList}>
        {[
          {
            icon: 'eye-outline',
            text: 'Visual context and composition analysis',
          },
          {
            icon: 'location-outline',
            text: 'Location-aware cultural understanding',
          },
          {
            icon: 'volume-medium-outline',
            text: 'Spoken narratives for immersive discovery',
          },
        ].map((item) => (
          <View key={item.text} style={styles.infoRow}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color="#7E7469" />
            <Text style={styles.infoText}>{item.text}</Text>
            <Ionicons name="chevron-forward" size={18} color="#5E564D" />
          </View>
        ))}
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
    paddingBottom: 48,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  glowCircle: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#1A2635',
    opacity: 0.65,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(39, 54, 78, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandLabel: {
    color: '#9E9A93',
    letterSpacing: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 46,
    fontWeight: '600',
    color: '#F4EFE6',
    lineHeight: 54,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(244, 239, 230, 0.6)',
    lineHeight: 22,
  },
  cardShell: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 22,
    backgroundColor: 'rgba(32, 28, 24, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F5EFE5',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(244, 239, 230, 0.6)',
  },
  cardAction: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(38, 54, 80, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(112, 135, 163, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(58, 49, 41, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(116, 99, 86, 0.4)',
  },
  pillText: {
    fontSize: 12,
    color: '#B8ACA0',
  },
  sectionRow: {
    marginTop: 26,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#7E7469',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#5E564D',
  },
  recentRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    marginHorizontal: 20,
  },
  recentCard: {
    flex: 1,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  recentImage: {
    borderRadius: 20,
  },
  recentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 18, 16, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentOverlay: {
    padding: 14,
    backgroundColor: 'rgba(12, 10, 9, 0.7)',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F6F0E7',
  },
  recentDescription: {
    marginTop: 6,
    fontSize: 11,
    color: 'rgba(246, 240, 231, 0.6)',
  },
  recentMeta: {
    marginTop: 8,
    fontSize: 11,
    color: '#8C8074',
  },
  primaryButton: {
    marginTop: 22,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 26,
    backgroundColor: 'rgba(41, 58, 82, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(123, 147, 179, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#CFE0F5',
  },
  sectionLabel: {
    marginTop: 24,
    marginHorizontal: 20,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#5E564D',
  },
  infoList: {
    marginTop: 14,
    marginHorizontal: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 23, 20, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  infoText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 13,
    color: 'rgba(216, 208, 196, 0.7)',
  },
});
