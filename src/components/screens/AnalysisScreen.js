/**
 * SENTIA - Analysis Screen
 *
 * Displays scan results with cultural information.
 * Shows analysis, audio guide, and nearby suggestions.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeWithPipeline, getNearbyPlaces } from '../../services/api';
import premiumService from '../../services/storage/premiumService';
import audioService from '../../services/audio';
import { CATEGORY_LABELS, CONFIDENCE, FEATURES } from '../../constants/categories';
import { COPY, ERRORS, UI_CONFIG } from '../../constants/config';
import AudioGuide from '../ui/AudioGuide';
import NearbyDiscovery from '../ui/NearbyDiscovery';
import PaywallSheet from '../ui/PaywallSheet';

/**
 * Analysis states
 */
const ANALYSIS_STATES = {
  IDLE: 'idle',
  CHECKING_RELEVANCE: 'checking_relevance',
  CLASSIFYING: 'classifying',
  ANALYZING: 'analyzing',
  COMPLETE: 'complete',
  NOT_RELEVANT: 'not_relevant',
  ERROR: 'error',
};

/**
 * Progress messages
 */
const PROGRESS_MESSAGES = {
  checking_relevance: COPY.checkingRelevance,
  classifying: COPY.classifying,
  analyzing: COPY.analyzing,
};

/**
 * Analysis Screen Component
 */
export default function AnalysisScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, location } = route.params || {};

  const [state, setState] = useState(ANALYSIS_STATES.CHECKING_RELEVANCE);
  const [progress, setProgress] = useState('checking_relevance');
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState(null);
  const [nearby, setNearby] = useState(null);
  const [notRelevantReason, setNotRelevantReason] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    // Check premium status
    const premium = await premiumService.init();
    setIsPremium(premium);

    // Start analysis pipeline
    await runAnalysis();
  };

  /**
   * Run the complete analysis pipeline
   */
  const runAnalysis = async () => {
    try {
      const response = await analyzeWithPipeline(imageUri, location, (step) => {
        setProgress(step);
      });

      // Handle not relevant case
      if (response.notRelevant) {
        setState(ANALYSIS_STATES.NOT_RELEVANT);
        setNotRelevantReason(response.reason);
        return;
      }

      // Analysis complete
      setResult(response.result);
      setCategory(response.category);
      setState(ANALYSIS_STATES.COMPLETE);

      // Record scan
      await premiumService.recordScan();

      // Fetch nearby places (premium feature)
      const nearbyData = await getNearbyPlaces(location, response.category);
      setNearby(nearbyData);

      // Auto-play audio if headphones connected (premium)
      if (premium) {
        const headphones = await audioService.areHeadphonesConnected();
        if (headphones && response.result.audioGuide) {
          playAudio();
        }
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setState(ANALYSIS_STATES.ERROR);

      // Show appropriate error message
      const message = error.message || ERRORS.NETWORK_ERROR;
      Alert.alert('Analysis Failed', message, [
        { text: 'Retry', onPress: () => setState(ANALYSIS_STATES.CHECKING_RELEVANCE) },
        { text: 'Back', onPress: () => navigation.goBack() },
      ]);
    }
  };

  /**
   * Play audio guide
   */
  const playAudio = async () => {
    if (!result?.audioGuide) return;

    // Check premium access
    const { canAccess, paywallData } = await premiumService.canAccess(FEATURES.AUDIO_GUIDE);
    if (!canAccess) {
      setPaywallVisible({ feature: FEATURES.AUDIO_GUIDE, ...paywallData });
      return;
    }

    setAudioPlaying(true);
    const response = await audioService.speak(result.audioGuide, () => {
      setAudioPlaying(false);
    });

    if (response.requiresPremium) {
      setPaywallVisible(response.paywallData);
      setAudioPlaying(false);
    }
  };

  /**
   * Stop audio
   */
  const stopAudio = async () => {
    await audioService.stop();
    setAudioPlaying(false);
  };

  /**
   * Handle nearby item press (premium check)
   */
  const handleNearbyPress = () => {
    if (!isPremium) {
      const paywallData = premiumService.getPaywallData(FEATURES.NEARBY_DISCOVERY);
      setPaywallVisible({ feature: FEATURES.NEARBY_DISCOVERY, ...paywallData });
    }
  };

  /**
   * Take new photo
   */
  const takeNewPhoto = () => {
    audioService.cleanup();
    navigation.replace('Camera');
  };

  /**
   * Render loading state
   */
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={styles.loadingText}>
        {PROGRESS_MESSAGES[progress] || COPY.analyzing}
      </Text>
    </View>
  );

  /**
   * Render not relevant state
   */
  const renderNotRelevant = () => (
    <View style={styles.notRelevantContainer}>
      <View style={styles.notRelevantIcon}>
        <Text style={styles.notRelevantIconText}>📷</Text>
      </View>
      <Text style={styles.notRelevantTitle}>{COPY.widerViewNeeded}</Text>
      <Text style={styles.notRelevantText}>{COPY.widerViewSuggestion}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={takeNewPhoto}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render error state
   */
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorText}>Please check your connection and try again.</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.retryButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render result
   */
  const renderResult = () => {
    if (!result || !category) return null;

    const confidenceLabel = {
      [CONFIDENCE.HIGH]: COPY.confidenceHigh,
      [CONFIDENCE.MEDIUM]: COPY.confidenceMedium,
      [CONFIDENCE.LOW]: COPY.confidenceLow,
    }[result.confidence] || '';

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Image preview */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{CATEGORY_LABELS[category]}</Text>
          </View>
        </View>

        {/* Title section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{result.title}</Text>
          {confidenceLabel ? (
            <Text style={styles.confidence}>{confidenceLabel}</Text>
          ) : null}
        </View>

        {/* Quick reason */}
        {result.quickReason ? (
          <View style={styles.section}>
            <Text style={styles.sectionText}>{result.quickReason}</Text>
          </View>
        ) : null}

        {/* Short explanation */}
        {result.shortExplanation ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionText}>{result.shortExplanation}</Text>
          </View>
        ) : null}

        {/* Why here */}
        {result.whyHere ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why it matters here</Text>
            <Text style={styles.sectionText}>{result.whyHere}</Text>
          </View>
        ) : null}

        {/* Tip */}
        {result.tip ? (
          <View style={styles.tipSection}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>{result.tip}</Text>
          </View>
        ) : null}

        {/* Audio guide */}
        {result.audioGuide ? (
          <AudioGuide
            text={result.audioGuide}
            isPlaying={audioPlaying}
            isPremium={isPremium}
            onPlay={playAudio}
            onStop={stopAudio}
          />
        ) : null}

        {/* Nearby discovery */}
        {nearby?.suggestions?.length > 0 ? (
          <NearbyDiscovery
            suggestions={nearby.suggestions}
            isPremium={isPremium}
            onPress={handleNearbyPress}
          />
        ) : null}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  };

  /**
   * Render header
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={takeNewPhoto}>
        <Text style={styles.headerButtonText}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>SENTIA</Text>
      <View style={styles.headerButton} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}

      {state === ANALYSIS_STATES.COMPLETE && renderResult()}
      {(state === ANALYSIS_STATES.CHECKING_RELEVANCE ||
        state === ANALYSIS_STATES.CLASSIFYING ||
        state === ANALYSIS_STATES.ANALYZING) && renderLoading()}
      {state === ANALYSIS_STATES.NOT_RELEVANT && renderNotRelevant()}
      {state === ANALYSIS_STATES.ERROR && renderError()}

      {/* Paywall sheet */}
      <PaywallSheet
        visible={!!paywallVisible}
        data={paywallVisible}
        onClose={() => setPaywallVisible(null)}
        onPurchase={() => {
          setPaywallVisible(null);
          // In production, handle purchase flow
          Alert.alert('Purchase', 'Purchase flow would be triggered here.');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#A0A0A0',
    fontWeight: '500',
  },
  // Not relevant
  notRelevantContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  notRelevantIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  notRelevantIconText: {
    fontSize: 40,
  },
  notRelevantTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  notRelevantText: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  // Result
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backdropFilter: 'blur(10px)',
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleSection: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#E8E8E8',
    lineHeight: 24,
  },
  tipSection: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#CCC',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
});
