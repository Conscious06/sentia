/**
 * SENTIA - Audio Service
 *
 * Handles text-to-speech for audio guides.
 * Uses AVSpeechSynthesizer via expo-av.
 */

import { Audio } from 'expo-av';
import premiumService from '../storage/premiumService';
import { FEATURES } from '../../constants/config';

/**
 * Audio Service
 *
 * Manages TTS playback for cultural audio guides.
 */
class AudioService {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentText = null;
    this.onPlaybackStatusUpdate = null;
  }

  /**
   * Initialize audio session
   */
  async init() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      return true;
    } catch (error) {
      console.error('Audio init error:', error);
      return false;
    }
  }

  /**
   * Check if audio is a premium feature
   */
  async checkPremium() {
    const { canAccess } = await premiumService.canAccess(FEATURES.AUDIO_GUIDE);
    return canAccess;
  }

  /**
   * Convert text to speech
   *
   * Uses expo-av's speech synthesis
   */
  async speak(text, onDone) {
    try {
      // Check premium status
      const canAccess = await this.checkPremium();
      if (!canAccess) {
        return {
          requiresPremium: true,
          paywallData: premiumService.getPaywallData(FEATURES.AUDIO_GUIDE),
        };
      }

      // Stop any current playback
      await this.stop();

      this.currentText = text;
      this.isPlaying = true;
      this.isPaused = false;

      // Create speech utterance
      // Note: expo-av uses the platform's TTS engine
      const speech = new Audio.Speech({
        text: text,
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9, // Slightly slower for clarity
      });

      // Set up status callback
      speech.setOnDoneCallback(() => {
        this.isPlaying = false;
        this.isPaused = false;
        onDone?.();
      });

      speech.setOnErrorCallback((error) => {
        console.error('Speech error:', error);
        this.isPlaying = false;
        this.isPaused = false;
      });

      this.sound = speech;

      // Start speaking
      await this.speakSpeech(speech);

      return {
        success: true,
        isPlaying: true,
      };

    } catch (error) {
      console.error('Speak error:', error);
      this.isPlaying = false;
      this.isPaused = false;
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Speak using expo-av Speech API
   */
  async speakSpeech(speech) {
    try {
      await Audio.Speech.speak(speech.text, {
        language: speech.language,
        pitch: speech.pitch,
        rate: speech.rate,
        onDone: speech.getOnDoneCallback(),
        onError: speech.getOnErrorCallback(),
      });
    } catch (error) {
      console.error('Speech speak error:', error);
      throw error;
    }
  }

  /**
   * Pause audio playback
   */
  async pause() {
    try {
      if (this.isPlaying && !this.isPaused) {
        await Audio.Speech.pause();
        this.isPaused = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Pause error:', error);
      return false;
    }
  }

  /**
   * Resume audio playback
   */
  async resume() {
    try {
      if (this.isPaused) {
        await Audio.Speech.resume();
        this.isPaused = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Resume error:', error);
      return false;
    }
  }

  /**
   * Stop audio playback
   */
  async stop() {
    try {
      if (this.isPlaying || this.isPaused) {
        await Audio.Speech.stop();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentText = null;
      }
      return true;
    } catch (error) {
      console.error('Stop error:', error);
      return false;
    }
  }

  /**
   * Check if currently playing
   */
  getIsPlaying() {
    return this.isPlaying && !this.isPaused;
  }

  /**
   * Check if currently paused
   */
  getIsPaused() {
    return this.isPaused;
  }

  /**
   * Get current text being spoken
   */
  getCurrentText() {
    return this.currentText;
  }

  /**
   * Check if headphones are connected (iOS only)
   *
   * Note: This requires checking audio route
   * Returns null if cannot determine
   */
  async areHeadphonesConnected() {
    try {
      const info = await Audio.getAudioModeAsync();
      // This is a simplified check - real implementation would check audio route
      return false;
    } catch (error) {
      return null;
    }
  }

  /**
   * Cleanup on unmount
   */
  async cleanup() {
    await this.stop();
    this.sound = null;
  }
}

// Export singleton
export default new AudioService();
