/**
 * SENTIA - Category Definitions
 *
 * Categories determine which AI prompt is used for analysis.
 * Each category has a specific focus and prompt template.
 */

export const CATEGORIES = {
  PLACE_OR_ENVIRONMENT: 'place_or_environment',
  BUILDING_OR_ARCHITECTURE: 'building_or_architecture',
  ARTWORK_OR_PAINTING: 'artwork_or_painting',
  SCULPTURE_OR_OBJECT: 'sculpture_or_object',
  UNCLEAR: 'unclear',
};

/**
 * Human-readable category names for UI display
 */
export const CATEGORY_LABELS = {
  [CATEGORIES.PLACE_OR_ENVIRONMENT]: 'Place',
  [CATEGORIES.BUILDING_OR_ARCHITECTURE]: 'Architecture',
  [CATEGORIES.ARTWORK_OR_PAINTING]: 'Artwork',
  [CATEGORIES.SCULPTURE_OR_OBJECT]: 'Sculpture',
  [CATEGORIES.UNCLEAR]: 'Unknown',
};

/**
 * Confidence levels for AI responses
 */
export const CONFIDENCE = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

/**
 * Feature flags for premium vs free tier
 */
export const FEATURES = {
  // Free tier: 3 scans per day
  FREE_DAILY_SCANS: 3,

  // Premium features
  AUDIO_GUIDE: 'audio_guide',
  NEARBY_DISCOVERY: 'nearby_discovery',
  UNLIMITED_SCANS: 'unlimited_scans',
};
