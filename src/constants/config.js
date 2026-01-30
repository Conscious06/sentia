/**
 * SENTIA - App Configuration
 *
 * Central configuration for the entire app.
 * Update these values based on your deployment.
 */

/**
 * API Configuration
 *
 * TODO: Update with your actual API endpoint
 * This should point to your backend service that handles:
 * - Relevance checks
 * - Category classification
 * - Main analysis requests
 * - Nearby discovery
 */
export const API_CONFIG = {
  // Your API base URL
  baseURL: 'https://api.sentia.app/v1',

  // Or for local development:
  // baseURL: 'http://localhost:3000/v1',

  // API endpoints
  endpoints: {
    relevance: '/analyze/relevance',
    category: '/analyze/category',
    analyze: '/analyze/main',
    nearby: '/discovery/nearby',
  },

  // Timeout in milliseconds
  timeout: 30000,

  // Maximum retries for failed requests
  maxRetries: 2,
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  SCAN_HISTORY: '@sentia_scan_history',
  SCAN_COUNT_TODAY: '@sentia_scan_count_today',
  LAST_SCAN_DATE: '@sentia_last_scan_date',
  IS_PREMIUM: '@sentia_is_premium',
};

/**
 * Date format for storage
 */
export const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  // Camera settings
  camera: {
    quality: 0.85,
    flashMode: 'auto',
    zoom: 0,
  },

  // Audio settings
  audio: {
    rate: 0.9, // Slightly slower for clarity
    pitch: 1.0,
    // iOS voices - premium quality
    preferredVoice: 'com.apple.ttsbundle.Samantha-compact',
  },

  // Animation durations (ms)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

/**
 * Feature limits
 */
export const LIMITS = {
  // Free tier daily scan limit
  FREE_DAILY_SCANS: 3,

  // Number of nearby suggestions
  NEARBY_SUGGESTIONS: 3,

  // Maximum scan history to store
  MAX_SCAN_HISTORY: 100,

  // Image upload size limit (MB)
  MAX_IMAGE_SIZE_MB: 10,
};

/**
 * Paywall configuration
 */
export const PAYWALL_CONFIG = {
  // Features that trigger paywall
  premiumFeatures: [
    'audio_guide',
    'nearby_discovery',
    'unlimited_scans',
  ],

  // In-app purchase product IDs
  // TODO: Configure these in App Store Connect
  products: {
    premiumMonthly: 'com.sentia.premium.monthly',
    premiumYearly: 'com.sentia.premium.yearly',
  },
};

/**
 * Error messages
 */
export const ERRORS = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect. Please check your connection.',
  TIMEOUT_ERROR: 'Request took too long. Please try again.',
  SERVER_ERROR: 'Service temporarily unavailable. Please try again later.',

  // Image errors
  IMAGE_TOO_LARGE: 'Image is too large. Please use a smaller image.',
  INVALID_IMAGE: 'Unable to process this image.',
  NO_IMAGE: 'Please take or select a photo first.',

  // Permission errors
  CAMERA_PERMISSION: 'Camera access is needed to scan places.',
  LOCATION_PERMISSION: 'Location access helps provide better context.',

  // Premium errors
  PREMIUM_REQUIRED: 'This feature requires SENTIA Premium.',
  DAILY_LIMIT_REACHED: 'You\'ve reached your daily scan limit.',
};

/**
 * Copy strings
 */
export const COPY = {
  // Onboarding / Camera
  cameraGuidance: 'Works best with places, art, streets, and surroundings',

  // Relevance gating
  widerViewNeeded: 'SENTIA needs a wider view to understand this place.',
  widerViewSuggestion: 'Try stepping back to capture more of the surroundings.',

  // Loading states
  analyzing: 'Analyzing...',
  checkingRelevance: 'Checking image...',
  classifying: 'Identifying category...',
  preparingGuide: 'Preparing your guide...',

  // Paywall
  paywallTitle: 'SENTIA Premium',
  paywallSubtitle: 'Unlock deeper cultural exploration',
  premiumFeatureAudio: 'Audio guides for every scan',
  premiumFeatureNearby: 'Discover nearby cultural places',
  premiumFeatureUnlimited: 'Unlimited scans',
  upgradeCta: 'Upgrade to Premium',
  restorePurchase: 'Restore Purchase',
  terms: 'Terms & Privacy Policy',

  // Empty states
  noScansYet: 'No scans yet',
  firstScanPrompt: 'Point your camera at something interesting',

  // Confidence labels
  confidenceHigh: 'High confidence',
  confidenceMedium: 'Likely',
  confidenceLow: 'Uncertain',
};
