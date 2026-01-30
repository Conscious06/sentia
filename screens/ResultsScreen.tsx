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
    if (conf.includes('high') || conf.includes('certain')) return '#27AE60';
    if (conf.includes('medium') || conf.includes('likely')) return '#F39C12';
    return '#E74C3C';
  };

  if (isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C3E50" />
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
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{analysis.title}</Text>
            <View
              style={[
                styles.confidenceBadge,
                { backgroundColor: getConfidenceColor(analysis.confidence) },
              ]}
            >
              <Text style={styles.confidenceText}>{analysis.confidence}</Text>
            </View>
          </View>
          <Text style={styles.oneLiner}>{analysis.one_liner}</Text>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={24} color="#2C3E50" />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <Text style={styles.sectionText}>{analysis.overview}</Text>
        </View>

        {/* History Section */}
        {analysis.history && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="hourglass-outline" size={24} color="#2C3E50" />
              <Text style={styles.sectionTitle}>History</Text>
            </View>
            <Text style={styles.sectionText}>{analysis.history}</Text>
          </View>
        )}

        {/* Architecture/Art Section */}
        {analysis.architecture_or_art && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={24} color="#2C3E50" />
              <Text style={styles.sectionTitle}>Architecture & Art</Text>
            </View>
            <Text style={styles.sectionText}>{analysis.architecture_or_art}</Text>
          </View>
        )}

        {/* Fun Fact Section */}
        {analysis.fun_fact && (
          <View style={[styles.section, styles.funFactSection]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles-outline" size={24} color="#F39C12" />
              <Text style={[styles.sectionTitle, styles.funFactTitle]}>Fun Fact</Text>
            </View>
            <Text style={styles.sectionText}>{analysis.fun_fact}</Text>
          </View>
        )}

        {/* Visitor Tip Section */}
        {analysis.visitor_tip && (
          <View style={[styles.section, styles.tipSection]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={24} color="#3498DB" />
              <Text style={styles.sectionTitle}>Visitor Tip</Text>
            </View>
            <Text style={styles.sectionText}>{analysis.visitor_tip}</Text>
          </View>
        )}

        {/* Audio Summary Section */}
        {analysis.audio_ready_summary && (
          <View style={[styles.section, styles.audioSection]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="volume-high-outline" size={24} color="#9B59B6" />
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
            <Ionicons name="camera-outline" size={20} color="#2C3E50" />
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
    backgroundColor: '#F5F6FA',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#2C3E50',
  },
  content: {
    padding: 20,
  },
  headerSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10,
  },
  confidenceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  oneLiner: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
  },
  sectionText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 22,
  },
  funFactSection: {
    backgroundColor: '#FEF9E7',
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  funFactTitle: {
    color: '#F39C12',
  },
  tipSection: {
    backgroundColor: '#EBF5FB',
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  audioSection: {
    backgroundColor: '#F5EEF8',
    borderLeftWidth: 4,
    borderLeftColor: '#9B59B6',
  },
  audioText: {
    fontSize: 14,
    color: '#5B2C6F',
    lineHeight: 22,
    fontStyle: 'italic',
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
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2C3E50',
    gap: 8,
  },
  actionButtonText: {
    color: '#2C3E50',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F6FA',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
