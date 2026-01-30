import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, CulturalAnalysis } from '../App';
import { analyzeImage } from '../services/analysisService';

type ResultsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

export default function ResultsScreen({ navigation, route }: ResultsScreenProps) {
  const { imageUrl, analysis: initialAnalysis } = route.params;
  const [analysis, setAnalysis] = useState<CulturalAnalysis>(initialAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const result = await analyzeImage(imageUrl);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze the image. Please try again.');
      Alert.alert(
        'Analysis Error',
        'Could not analyze the image. This might be due to network issues or the image being unclear.',
        [
          { text: 'Try Again', onPress: performAnalysis },
          { text: 'Go Back', onPress: () => navigation.goBack() },
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    const conf = confidence.toLowerCase();
    if (conf.includes('high') || conf.includes('certain')) return 'rgba(70, 130, 95, 0.6)';
    if (conf.includes('medium') || conf.includes('likely')) return 'rgba(130, 115, 95, 0.6)';
    return 'rgba(140, 70, 70, 0.6)';
  };

  if (isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C7BBAA" />
        <Text style={styles.loadingText}>Analyzing your image...</Text>
        <Text style={styles.loadingSubtext}>
          Our AI is examining the cultural and historical elements
        </Text>
      </View>
    );
  }

  if (error && !analysis.title) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
        <Text style={styles.errorTitle}>Analysis Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={performAnalysis}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.hero}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.confidenceBadge,
                { backgroundColor: getConfidenceColor(analysis.confidence) },
              ]}
            >
              <Text style={styles.confidenceText}>{analysis.confidence}</Text>
            </View>
          </View>
          <Text style={styles.title}>{analysis.title}</Text>
          <Text style={styles.oneLiner}>{analysis.one_liner}</Text>
        </View>
      </View>

      <View style={styles.content}>

        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={20} color="#C7BBAA" />
            <Text style={styles.sectionTitle}>Context</Text>
          </View>
          <Text style={styles.sectionText}>{analysis.overview}</Text>
        </View>

        {/* History Section */}
        {analysis.history && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
            <Ionicons name="hourglass-outline" size={20} color="#C7BBAA" />
            <Text style={styles.sectionTitle}>History</Text>
          </View>
          <Text style={styles.sectionText}>{analysis.history}</Text>
        </View>
        )}

        {/* Architecture/Art Section */}
        {analysis.architecture_or_art && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
            <Ionicons name="business-outline" size={20} color="#C7BBAA" />
            <Text style={styles.sectionTitle}>Architecture & Art</Text>
          </View>
          <Text style={styles.sectionText}>{analysis.architecture_or_art}</Text>
        </View>
        )}

        {/* Fun Fact Section */}
        {analysis.fun_fact && (
          <View style={[styles.section, styles.funFactSection]}>
            <View style={styles.sectionHeader}>
            <Ionicons name="sparkles-outline" size={20} color="#E6C16E" />
            <Text style={[styles.sectionTitle, styles.funFactTitle]}>Suggestion</Text>
          </View>
          <Text style={styles.sectionText}>{analysis.fun_fact}</Text>
        </View>
        )}

        {/* Visitor Tip Section */}
        {analysis.visitor_tip && (
          <View style={[styles.section, styles.tipSection]}>
            <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#7FA5C7" />
            <Text style={styles.sectionTitle}>Visitor Tip</Text>
          </View>
          <Text style={styles.sectionText}>{analysis.visitor_tip}</Text>
        </View>
        )}

        {/* Audio Summary Section */}
        {analysis.audio_ready_summary && (
          <View style={[styles.section, styles.audioSection]}>
            <View style={styles.sectionHeader}>
            <Ionicons name="volume-high-outline" size={20} color="#B296D9" />
            <Text style={styles.sectionTitle}>Audio Summary</Text>
          </View>
          <Text style={styles.audioText}>{analysis.audio_ready_summary}</Text>
        </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="camera-outline" size={20} color="#E8E1D5" />
            <Text style={styles.actionButtonText}>New Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0A09',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  hero: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 360,
    backgroundColor: '#1F1B18',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  heroContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F7F2E9',
    marginBottom: 10,
  },
  confidenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  confidenceText: {
    color: '#F7F2E9',
    fontSize: 12,
    fontWeight: '600',
  },
  oneLiner: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 20,
    maxWidth: 320,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(33, 28, 23, 0.95)',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionText: {
    fontSize: 14,
    color: '#F0E6DA',
    lineHeight: 22,
  },
  funFactSection: {
    backgroundColor: 'rgba(42, 34, 26, 0.95)',
    borderLeftWidth: 3,
    borderLeftColor: '#E6C16E',
  },
  funFactTitle: {
    color: '#E6C16E',
  },
  tipSection: {
    backgroundColor: 'rgba(33, 35, 38, 0.95)',
    borderLeftWidth: 3,
    borderLeftColor: '#7FA5C7',
  },
  audioSection: {
    backgroundColor: 'rgba(40, 30, 45, 0.95)',
    borderLeftWidth: 3,
    borderLeftColor: '#B296D9',
  },
  audioText: {
    fontSize: 14,
    color: '#E7D9F6',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(33, 28, 23, 0.95)',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  actionButtonText: {
    color: '#E8E1D5',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#0B0A09',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F2E9',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#0B0A09',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F7F2E9',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#1E1A17',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#F7F2E9',
    fontSize: 16,
    fontWeight: '600',
  },
});
