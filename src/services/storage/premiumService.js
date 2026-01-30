/**
 * SENTIA - Premium Service
 *
 * Manages premium features, paywall triggers, and in-app purchases.
 *
 * NOTE: This is a placeholder implementation.
 * For production, integrate with expo-store-commerce or RevenueCat.
 */

import { premiumStorage } from './storageService';
import { FEATURES, PAYWALL_CONFIG } from '../../constants/config';

/**
 * Premium Service
 *
 * Handles premium feature checks and paywall logic.
 */
class PremiumService {
  constructor() {
    this.isPremium = false;
    this.cached = false;
  }

  /**
   * Initialize premium status from storage
   */
  async init() {
    if (this.cached) return this.isPremium;

    this.isPremium = await premiumStorage.isPremium();
    this.cached = true;
    return this.isPremium;
  }

  /**
   * Check if user has premium
   */
  async checkPremium() {
    return await this.init();
  }

  /**
   * Check if a feature requires premium
   */
  requiresPremium(feature) {
    return PAYWALL_CONFIG.premiumFeatures.includes(feature);
  }

  /**
   * Check if user can access a feature
   */
  async canAccess(feature) {
    if (!this.requiresPremium(feature)) {
      return { canAccess: true, requiresPremium: false };
    }

    const isPremium = await this.checkPremium();
    return {
      canAccess: isPremium,
      requiresPremium: true,
      isPremium,
    };
  }

  /**
   * Trigger paywall for a feature
   *
   * Returns paywall data to display
   */
  getPaywallData(feature) {
    const featureMessages = {
      [FEATURES.AUDIO_GUIDE]: {
        title: 'Audio Guides',
        description: 'Listen to cultural stories about the places you visit.',
      },
      [FEATURES.NEARBY_DISCOVERY]: {
        title: 'Nearby Discovery',
        description: 'Find museums, galleries, and cultural spots nearby.',
      },
      [FEATURES.UNLIMITED_SCANS]: {
        title: 'Unlimited Scans',
        description: 'Scan as many places as you like without limits.',
      },
    };

    const featureInfo = featureMessages[feature] || {
      title: 'SENTIA Premium',
      description: 'Unlock all premium features.',
    };

    return {
      ...featureInfo,
      features: [
        'Unlimited scans',
        'Audio guides for every place',
        'Nearby cultural discovery',
      ],
      cta: 'Upgrade to Premium',
    };
  }

  /**
   * Purchase premium (placeholder)
   *
   * In production, integrate with IAP library:
   * - expo-store-commerce (Expo)
   * - RevenueCat (recommended)
   * - react-native-iap
   */
  async purchase() {
    // TODO: Implement actual IAP flow
    console.log('IAP: Purchase initiated');

    // Simulate successful purchase for testing
    await premiumStorage.setPremium(true);
    this.isPremium = true;

    return { success: true };
  }

  /**
   * Restore purchase (placeholder)
   */
  async restore() {
    // TODO: Implement actual restore flow
    console.log('IAP: Restore purchase');

    // Simulate restore for testing
    const isPremium = await premiumStorage.isPremium();
    this.isPremium = isPremium;

    return { success: true, isPremium };
  }

  /**
   * Check if user can scan today
   */
  async canScan() {
    const isPremium = await this.checkPremium();
    const { limitStorage } = await import('./storageService');
    return await limitStorage.canScan(isPremium);
  }

  /**
   * Increment scan count after successful scan
   */
  async recordScan() {
    const isPremium = await this.checkPremium();
    if (!isPremium) {
      const { limitStorage } = await import('./storageService');
      await limitStorage.incrementCount();
    }
  }

  /**
   * Reset premium status (for testing only)
   */
  async resetPremium() {
    await premiumStorage.setPremium(false);
    this.isPremium = false;
    this.cached = false;
  }

  /**
   * Set premium (for testing only)
   */
  async setPremium(isPremium) {
    await premiumStorage.setPremium(isPremium);
    this.isPremium = isPremium;
    this.cached = true;
  }
}

// Export singleton
export default new PremiumService();
