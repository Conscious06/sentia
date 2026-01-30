/**
 * SENTIA - Paywall Sheet Component
 *
 * Calm, value-focused paywall for premium features.
 * No aggressive "buy now" language.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Paywall Sheet Component
 */
export default function PaywallSheet({ visible, data, onClose, onPurchase }) {
  if (!visible || !data) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.content}>
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✨</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{data.title || 'SENTIA Premium'}</Text>
            <Text style={styles.subtitle}>{data.description}</Text>

            {/* Features list */}
            <View style={styles.featuresContainer}>
              {data.features?.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={styles.featureBullet}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* CTA buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={onPurchase}
              >
                <Text style={styles.upgradeButtonText}>
                  {data.cta || 'Upgrade to Premium'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => {
                  // Handle restore purchase
                  onClose();
                }}
              >
                <Text style={styles.restoreButtonText}>Restore Purchase</Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <Text style={styles.terms}>
              By upgrading, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 24,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#888',
    fontWeight: '300',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureBullet: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: '700',
  },
  featureText: {
    fontSize: 16,
    color: '#E8E8E8',
    flex: 1,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  restoreButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },
  terms: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
