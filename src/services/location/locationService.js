/**
 * SENTIA - Location Service
 *
 * Handles location permission and GPS coordinates.
 * Location improves AI context but is not mandatory.
 */

import * as Location from 'expo-location';
import { ERRORS } from '../../constants/config';

/**
 * Location Service
 *
 * Manages device location for cultural context.
 */
class LocationService {
  constructor() {
    this.currentLocation = null;
    this.permissionGranted = false;
  }

  /**
   * Request location permission
   *
 * Returns true if permission granted, false otherwise
   */
  async requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      this.permissionGranted = status === 'granted';

      if (!this.permissionGranted) {
        console.log('Location permission denied');
      }

      return this.permissionGranted;

    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  /**
   * Check current permission status
   */
  async checkPermission() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      this.permissionGranted = status === 'granted';
      return this.permissionGranted;
    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  /**
   * Get current location
   *
 * Returns {latitude, longitude, accuracy} or null
 */
  async getCurrentLocation() {
    try {
      // Check permission first
      if (!this.permissionGranted) {
        const granted = await this.requestPermission();
        if (!granted) {
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };

      return this.currentLocation;

    } catch (error) {
      console.error('Get location error:', error);

      // Handle specific errors
      if (error.message?.includes('Location permissions')) {
        return null;
      }

      return null;
    }
  }

  /**
   * Get cached location (faster, may be stale)
   */
  async getCachedLocation() {
    if (this.currentLocation) {
      return this.currentLocation;
    }

    return await this.getCurrentLocation();
  }

  /**
   * Watch location changes
   *
 * Returns a subscription object - call remove() to unsubscribe
   */
  async watchLocation(callback) {
    try {
      if (!this.permissionGranted) {
        const granted = await this.requestPermission();
        if (!granted) {
          return null;
        }
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          this.currentLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          };
          callback(this.currentLocation);
        }
      );

      return subscription;

    } catch (error) {
      console.error('Watch location error:', error);
      return null;
    }
  }

  /**
   * Check if location is available and reasonably accurate
   */
  isLocationAvailable() {
    return this.currentLocation && this.currentLocation.accuracy < 100;
  }

  /**
   * Format location for display (debugging)
   */
  formatLocation(location = this.currentLocation) {
    if (!location) return 'No location';

    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }

  /**
   * Reset location (clear cache)
   */
  reset() {
    this.currentLocation = null;
  }
}

// Export singleton
export default new LocationService();
