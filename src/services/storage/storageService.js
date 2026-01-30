/**
 * SENTIA - Storage Service
 *
 * Handles all persistent storage using AsyncStorage.
 * Manages scan history, daily limits, and premium status.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/config';

/**
 * Generic storage helpers
 */
const storage = {
  /**
   * Get item from storage
   */
  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Storage get error for ${key}:`, error);
      return null;
    }
  },

  /**
   * Set item in storage
   */
  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage set error for ${key}:`, error);
      return false;
    }
  },

  /**
   * Remove item from storage
   */
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage remove error for ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all storage (useful for logout/debug)
   */
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },
};

/**
 * Date helpers for daily limit tracking
 */
const dateUtils = {
  /**
   * Get today's date string in local timezone
   */
  getTodayString: () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD
  },

  /**
   * Check if a date string is today
   */
  isToday: (dateString) => {
    return dateString === dateUtils.getTodayString();
  },
};

/**
 * Scan Management
 */
export const scanStorage = {
  /**
   * Get scan history
   */
  getHistory: async () => {
    return await storage.get(STORAGE_KEYS.SCAN_HISTORY) || [];
  },

  /**
   * Add scan to history
   */
  addScan: async (scan) => {
    try {
      const history = await scanStorage.getHistory();
      const updatedHistory = [scan, ...history].slice(0, 100); // Keep last 100
      await storage.set(STORAGE_KEYS.SCAN_HISTORY, updatedHistory);
      return true;
    } catch (error) {
      console.error('Add scan error:', error);
      return false;
    }
  },

  /**
   * Delete scan from history
   */
  deleteScan: async (scanId) => {
    try {
      const history = await scanStorage.getHistory();
      const updated = history.filter(s => s.id !== scanId);
      await storage.set(STORAGE_KEYS.SCAN_HISTORY, updated);
      return true;
    } catch (error) {
      console.error('Delete scan error:', error);
      return false;
    }
  },

  /**
   * Clear all scan history
   */
  clearHistory: async () => {
    return await storage.remove(STORAGE_KEYS.SCAN_HISTORY);
  },
};

/**
 * Daily Limit Management
 */
export const limitStorage = {
  /**
   * Get today's scan count
   */
  getTodayCount: async () => {
    const lastDate = await storage.get(STORAGE_KEYS.LAST_SCAN_DATE);
    const count = await storage.get(STORAGE_KEYS.SCAN_COUNT_TODAY);

    // Reset count if it's a new day
    if (!dateUtils.isToday(lastDate)) {
      await limitStorage.resetCount();
      return 0;
    }

    return count || 0;
  },

  /**
   * Increment scan count for today
   */
  incrementCount: async () => {
    const currentCount = await limitStorage.getTodayCount();
    const newCount = currentCount + 1;

    await storage.set(STORAGE_KEYS.SCAN_COUNT_TODAY, newCount);
    await storage.set(STORAGE_KEYS.LAST_SCAN_DATE, dateUtils.getTodayString());

    return newCount;
  },

  /**
   * Reset daily count
   */
  resetCount: async () => {
    await storage.set(STORAGE_KEYS.SCAN_COUNT_TODAY, 0);
    await storage.set(STORAGE_KEYS.LAST_SCAN_DATE, dateUtils.getTodayString());
  },

  /**
   * Check if user can scan (not at daily limit)
   */
  canScan: async (isPremium) => {
    if (isPremium) return { canScan: true, remaining: Infinity };

    const count = await limitStorage.getTodayCount();
    const { FREE_DAILY_SCANS } = await import('../../constants/config').then(m => m.LIMITS);

    return {
      canScan: count < FREE_DAILY_SCANS,
      remaining: Math.max(0, FREE_DAILY_SCANS - count),
      used: count,
      limit: FREE_DAILY_SCANS,
    };
  },
};

/**
 * Premium Status Management
 */
export const premiumStorage = {
  /**
   * Check if user is premium
   */
  isPremium: async () => {
    return await storage.get(STORAGE_KEYS.IS_PREMIUM) || false;
  },

  /**
   * Set premium status
   */
  setPremium: async (isPremium) => {
    return await storage.set(STORAGE_KEYS.IS_PREMIUM, isPremium);
  },

  /**
   * Activate premium (for testing or after purchase)
   */
  activatePremium: async () => {
    return await premiumStorage.setPremium(true);
  },

  /**
   * Deactivate premium (for testing)
   */
  deactivatePremium: async () => {
    return await premiumStorage.setPremium(false);
  },
};

/**
 * Debug utilities (remove in production)
 */
export const debugStorage = {
  /**
   * Get all storage data
   */
  getAll: async () => {
    const keys = Object.values(STORAGE_KEYS);
    const data = {};

    for (const key of keys) {
      data[key] = await storage.get(key);
    }

    return data;
  },

  /**
   * Reset scan limits (for testing)
   */
  resetLimits: async () => {
    await limitStorage.resetCount();
  },

  /**
   * Toggle premium (for testing)
   */
  togglePremium: async () => {
    const current = await premiumStorage.isPremium();
    return await premiumStorage.setPremium(!current);
  },
};

export default storage;
