/**
 * SENTIA - Analyze Service
 *
 * Main service for analyzing images.
 * Handles: relevance check → category classification → main analysis
 */

import apiClient, { APIError } from './apiClient';
import { getAnalysisPrompt, RELEVANCE_CHECK_PROMPT, CATEGORY_CLASSIFICATION_PROMPT } from '../../constants/prompts';
import { CATEGORIES } from '../../constants/categories';
import { ERRORS } from '../../constants/config';

/**
 * Relevance Check
 *
 * Lightweight check to determine if image is worth analyzing.
 * Filters out close-up objects, textures, etc.
 *
 * @param {string} imageUri - Local image URI
 * @returns {Promise<{isRelevant: boolean, reason: string}>}
 */
export const checkRelevance = async (imageUri) => {
  try {
    const response = await apiClient.postImage(
      API_CONFIG.endpoints.relevance,
      imageUri,
      { prompt: RELEVANCE_CHECK_PROMPT }
    );

    return {
      isRelevant: response.isRelevant ?? false,
      reason: response.reason || '',
    };
  } catch (error) {
    console.error('Relevance check failed:', error);
    // On network error, default to relevant to avoid blocking users
    if (error.message === ERRORS.NETWORK_ERROR || error.message === ERRORS.TIMEOUT_ERROR) {
      return { isRelevant: true, reason: '' };
    }
    throw error;
  }
};

/**
 * Category Classification
 *
 * Determines which category the image belongs to.
 * This determines which prompt to use for main analysis.
 *
 * @param {string} imageUri - Local image URI
 * @returns {Promise<{category: string, confidence: string}>}
 */
export const classifyCategory = async (imageUri) => {
  try {
    const response = await apiClient.postImage(
      API_CONFIG.endpoints.category,
      imageUri,
      { prompt: CATEGORY_CLASSIFICATION_PROMPT }
    );

    // Validate category
    const validCategories = Object.values(CATEGORIES);
    const category = validCategories.includes(response.category)
      ? response.category
      : CATEGORIES.UNCLEAR;

    return {
      category,
      confidence: response.confidence || 'low',
    };
  } catch (error) {
    console.error('Category classification failed:', error);
    // Default to unclear on error
    return {
      category: CATEGORIES.UNCLEAR,
      confidence: 'low',
    };
  }
};

/**
 * Main Analysis
 *
 * Full cultural analysis based on category.
 * Uses category-specific prompt for best results.
 *
 * @param {string} imageUri - Local image URI
 * @param {string} category - Classified category
 * @param {Object} location - Optional location data {latitude, longitude}
 * @returns {Promise<AnalysisResponse>}
 */
export const analyzeImage = async (imageUri, category, location = null) => {
  try {
    const prompt = getAnalysisPrompt(category, location);

    const response = await apiClient.postImage(
      API_CONFIG.endpoints.analyze,
      imageUri,
      { prompt }
    );

    // Validate response structure
    return {
      title: response.title || 'Unknown',
      confidence: response.confidence || 'low',
      category: response.category || category,
      quickReason: response.quickReason || '',
      shortExplanation: response.shortExplanation || '',
      whyHere: response.whyHere || '',
      audioGuide: response.audioGuide || '',
      tip: response.tip || null,
    };
  } catch (error) {
    console.error('Analysis failed:', error);

    if (error instanceof APIError) {
      throw error;
    }

    // Return a safe fallback on unexpected errors
    return {
      title: 'Analysis unavailable',
      confidence: 'low',
      category,
      quickReason: 'Unable to analyze this image.',
      shortExplanation: 'Please try again with a different photo.',
      whyHere: '',
      audioGuide: '',
      tip: null,
    };
  }
};

/**
 * Complete Analysis Pipeline
 *
 * Runs the full pipeline: relevance → category → analysis
 *
 * @param {string} imageUri - Local image URI
 * @param {Object} location - Optional location data
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<{result: AnalysisResponse, category: string}>}
 */
export const analyzeWithPipeline = async (imageUri, location = null, onProgress) => {
  try {
    // Step 1: Relevance check
    onProgress?.('checking_relevance');
    const relevance = await checkRelevance(imageUri);

    if (!relevance.isRelevant) {
      return {
        notRelevant: true,
        reason: relevance.reason,
      };
    }

    // Step 2: Category classification
    onProgress?.('classifying');
    const { category } = await classifyCategory(imageUri);

    // Step 3: Main analysis
    onProgress?.('analyzing');
    const result = await analyzeImage(imageUri, category, location);

    return {
      result,
      category,
      notRelevant: false,
    };

  } catch (error) {
    console.error('Analysis pipeline failed:', error);
    throw error;
  }
};

/**
 * Retry analysis with different category
 *
 * If initial analysis seems off, retry with a different category
 */
export const retryWithCategory = async (imageUri, newCategory, location = null) => {
  return analyzeImage(imageUri, newCategory, location);
};
