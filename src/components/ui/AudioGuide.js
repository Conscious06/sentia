/**
 * SENTIA - Audio Guide Component
 *
 * TTS audio player with premium gating.
 * Shows play/pause controls and audio text.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import premiumService from '../../services/storage/premiumService';
import { FEATURES } from '../../constants/categories';

/**
 * Audio Guide Component
 */
export default function AudioGuide({ text, isPlaying, isPremium, onPlay, onStop }) {
  const [showFullText, setShowFullText] = useState(false);

  const handleTogglePlay = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  const isLongText = text?.length > 150;
  const displayText = isLongText && !showFullText
    ? text.substring(0, 150) + '...'
    : text;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audio Guide</Text>
        {!isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.playButton}
        onPress={handleTogglePlay}
        activeOpacity={0.8}
      >
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        <Text style={styles.playText}>
          {isPlaying ? 'Pause' : 'Play Audio Guide'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.transcript}>{displayText}</Text>

      {isLongText && !showFullText && (
        <TouchableOpacity onPress={() => setShowFullText(true)}>
          <Text style={styles.readMore}>Read more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  playIcon: {
    fontSize: 20,
    color: '#000',
  },
  playText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  transcript: {
    fontSize: 15,
    color: '#A0A0A0',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  readMore: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    fontWeight: '500',
  },
});
