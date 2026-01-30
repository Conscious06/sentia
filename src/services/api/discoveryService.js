/**
 * SENTIA - Discovery Service
 *
 * Nearby cultural place discovery.
 * Finds museums, galleries, landmarks, and walking routes near user.
 */

import apiClient from './apiClient';
import { buildNearbyPrompt } from '../../constants/prompts';
import { ERRORS } from '../../constants/config';

/**
 * Get Nearby Cultural Places
 *
 * Suggests up to 3 nearby cultural places based on:
 * - User's current location
 * - What they just scanned (for relevance)
 *
 * @param {Object} location - {latitude, longitude}
 * @param {string} currentCategory - Category of current scan
 * @returns {Promise<NearbyResponse>}
 */
export const getNearbyPlaces = async (location, currentCategory) => {
  if (!location || !location.latitude || !location.longitude) {
    // Return empty if no location
    return { suggestions: [] };
  }

  try {
    const response = await apiClient.post(
      API_CONFIG.endpoints.nearby,
      {
        prompt: buildNearbyPrompt(location, currentCategory),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }
    );

    // Validate and limit suggestions
    const suggestions = (response.suggestions || [])
      .slice(0, 3)
      .filter(s => s.name && s.description);

    return {
      suggestions: suggestions.map(s => ({
        name: s.name,
        type: s.type || 'city_exploration',
        description: s.description,
        distance: s.distance || null,
      }))
    };

  } catch (error) {
    console.error('Nearby discovery failed:', error);

    // Return empty on error (don't block main experience)
    return { suggestions: [] };
  }
};

/**
 * Get nearby suggestions grouped by type
 *
 * Returns an object with grouped suggestions for easier UI rendering
 */
export const getGroupedSuggestions = (suggestions) => {
  const groups = {
    museum: [],
    city_exploration: [],
    walking_route: [],
  };

  suggestions.forEach(suggestion => {
    const type = groups[suggestion.type] ? suggestion.type : 'city_exploration';
    groups[type].push(suggestion);
  });

  return groups;
};

/**
 * Check if user has any nearby suggestions
 */
export const hasNearbySuggestions = (nearbyResponse) => {
  return nearbyResponse?.suggestions?.length > 0;
};
