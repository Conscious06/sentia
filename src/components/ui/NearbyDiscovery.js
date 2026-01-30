/**
 * SENTIA - Nearby Discovery Component
 *
 * Shows up to 3 nearby cultural places.
 * Premium feature - limited preview for free users.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

/**
 * Nearby Discovery Component
 */
export default function NearbyDiscovery({ suggestions, isPremium, onPress }) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  // For free users, show only 1 suggestion blurred
  const showSuggestions = isPremium ? suggestions : suggestions.slice(0, 1);
  const hasMore = !isPremium && suggestions.length > 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Discovery</Text>
        {!isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showSuggestions.map((suggestion, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{suggestion.name}</Text>
              <Text style={styles.cardType}>{getTypeLabel(suggestion.type)}</Text>
            </View>
            <Text style={styles.cardDescription}>{suggestion.description}</Text>
            {suggestion.distance && (
              <Text style={styles.cardDistance}>{suggestion.distance}</Text>
            )}
          </View>
        ))}

        {hasMore && (
          <TouchableOpacity style={styles.upgradeCard} onPress={onPress}>
            <Text style={styles.upgradeIcon}>✨</Text>
            <Text style={styles.upgradeTitle}>See More Nearby</Text>
            <Text style={styles.upgradeText}>
              {suggestions.length - 1} more places to explore
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

/**
 * Get readable label for suggestion type
 */
function getTypeLabel(type) {
  const labels = {
    museum: 'Museum',
    city_exploration: 'Landmark',
    walking_route: 'Walking Route',
  };
  return labels[type] || 'Place';
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingLeft: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  card: {
    width: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  cardType: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  cardDistance: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  upgradeCard: {
    width: 200,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
  },
  upgradeIcon: {
    fontSize: 28,
  },
  upgradeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center',
  },
  upgradeText: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
  },
});
