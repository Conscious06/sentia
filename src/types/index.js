/**
 * SENTIA - TypeScript-style type definitions (JSDoc)
 *
 * Type definitions for the entire app.
 * Uses JSDoc for better IDE support in JavaScript.
 */

/**
 * @typedef {import('../constants/categories').CategoryType} CategoryType
 */

/**
 * Analysis response from the AI service
 * @typedef {Object} AnalysisResponse
 * @property {string} title - Short, descriptive name
 * @property {'high'|'medium'|'low'} confidence - AI confidence level
 * @property {string} category - Category classification
 * @property {string} quickReason - 1-2 sentence explanation
 * @property {string} shortExplanation - 2-3 sentence detailed explanation
 * @property {string} whyHere - Cultural context
 * @property {string} audioGuide - TTS-optimized text (20-30 seconds)
 * @property {string|null} tip - Optional visitor tip
 */

/**
 * Relevance check response
 * @typedef {Object} RelevanceCheckResponse
 * @property {boolean} isRelevant - Whether image is relevant for cultural analysis
 * @property {string} reason - Explanation of relevance decision
 */

/**
 * Category classification response
 * @typedef {Object} CategoryResponse
 * @property {string} category - Classified category
 * @property {'high'|'medium'|'low'} confidence - Classification confidence
 */

/**
 * Location data
 * @typedef {Object} LocationData
 * @property {number} latitude - Latitude coordinate
 * @property {number} longitude - Longitude coordinate
 * @property {number} [accuracy] - Location accuracy in meters
 */

/**
 * Nearby discovery suggestion
 * @typedef {Object} NearbySuggestion
 * @property {string} name - Place name
 * @property {'museum'|'city_exploration'|'walking_route'} type - Suggestion type
 * @property {string} description - Why it's worth visiting
 * @property {string} [distance] - Approximate walking distance
 */

/**
 * Nearby discovery response
 * @typedef {Object} NearbyResponse
 * @property {NearbySuggestion[]} suggestions - Array of nearby places
 */

/**
 * User scan record for storage
 * @typedef {Object} ScanRecord
 * @property {string} id - Unique scan ID
 * @property {string} timestamp - ISO timestamp
 * @property {string} imageUri - Local image path
 * @property {LocationData} [location] - Optional location
 */

/**
 * Scan data with analysis result
 * @typedef {Object} ScanResult
 * @property {string} id - Unique scan ID
 * @property {string} imageUri - Image URI
 * @property {LocationData} [location] - Location data
 * @property {AnalysisResponse} analysis - AI analysis result
 * @property {NearbyResponse} [nearby] - Optional nearby places
 * @property {string} timestamp - ISO timestamp
 */

/**
 * API error response
 * @typedef {Object} APIError
 * @property {string} message - Error message
 * @property {number} [code] - Error code
 * @property {string} [details] - Additional error details
 */

/**
 * Storage keys
 * @typedef {Object} StorageKeys
 * @property {string} SCANS - Key for scan history
 * @property {string} SCAN_COUNT_TODAY - Key for daily scan count
 * @property {string} LAST_SCAN_DATE - Key for tracking scan date
 * @property {string} IS_PREMIUM - Key for premium status
 */

/**
 * Navigation params
 * @typedef {Object} NavigationParams
 * @property {ScanResult} [scanResult] - Scan result data
 * @property {string} [imageUri] - Image URI for new scan
 * @property {LocationData} [location] - Location data
 * @property {string} [fromScreen] - Source screen for analytics
 */

/**
 * Audio player state
 * @typedef {Object} AudioState
 * @property {boolean} isPlaying - Whether audio is currently playing
 * @property {boolean} isPaused - Whether audio is paused
 * @property {number} [duration] - Audio duration in ms
 * @property {number} [position] - Current playback position
 */
