/**
 * SENTIA - API Client
 *
 * Base HTTP client for all API requests.
 * Handles error parsing, retries, and request/response logging.
 */

import { API_CONFIG, ERRORS } from '../../constants/config';

/**
 * Create an API error with additional context
 */
class APIError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Parse different error types and return user-friendly message
 */
const parseError = (error) => {
  if (error instanceof APIError) {
    return error;
  }

  // Network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new Error(ERRORS.TIMEOUT_ERROR);
    }
    return new Error(ERRORS.NETWORK_ERROR);
  }

  // HTTP errors
  const status = error.response.status;
  const data = error.response.data;

  switch (status) {
    case 400:
      return new Error(data?.message || ERRORS.INVALID_IMAGE);
    case 401:
      return new Error('Unauthorized. Please check your API key.');
    case 429:
      return new Error('Too many requests. Please wait a moment.');
    case 500:
    case 502:
    case 503:
      return new Error(ERRORS.SERVER_ERROR);
    default:
      return new Error(data?.message || ERRORS.NETWORK_ERROR);
  }
};

/**
 * Base API client class
 *
 * Uses fetch API (available in React Native)
 * In production, you might want to use axios or add request caching
 */
class APIClient {
  constructor(config = API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.maxRetries = config.maxRetries;
  }

  /**
   * Build full URL for endpoint
   */
  buildURL(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Build request headers
   */
  buildHeaders(customHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };
  }

  /**
   * Convert image to base64 for upload
   * Note: In production, consider using multipart/form-data for better performance
   */
  async imageToBase64(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      // Check file size
      const sizeInMB = blob.size / (1024 * 1024);
      if (sizeInMB > 10) {
        throw new Error(ERRORS.IMAGE_TOO_LARGE);
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Remove data:image/...;base64, prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error(ERRORS.INVALID_IMAGE);
    }
  }

  /**
   * Make HTTP request with timeout and retries
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const url = this.buildURL(endpoint);
    const headers = this.buildHeaders(options.headers);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw {
          response: {
            status: response.status,
            data,
          },
        };
      }

      // Return parsed JSON
      return await response.json();

    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on network errors (not on 4xx errors)
      if (retryCount < this.maxRetries && !error.response?.status) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request(endpoint, options, retryCount + 1);
      }

      throw parseError(error);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * POST request with image
   */
  async postImage(endpoint, imageUri, additionalData = {}) {
    const base64Image = await this.imageToBase64(imageUri);

    return this.post(endpoint, {
      image: base64Image,
      ...additionalData,
    });
  }
}

// Export singleton instance
export default new APIClient();

// Export error class for custom error handling
export { APIError };
