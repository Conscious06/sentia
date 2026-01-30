import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EMPTY_JSON = {
  title: 'Unknown object',
  confidence: 'low',
  category: 'ordinary structure',
  quick_reason: 'No image has been analyzed yet.',
  short_explanation: 'Add a photo so the app can generate a simple, honest description.',
  why_here: 'Not enough information to explain why this exists here.',
  audio_guide: 'Please add a photo so I can describe what you are seeing.',
  tip: null,
};

function buildResponse({ hasImage, gps, notes }) {
  if (!hasImage) return EMPTY_JSON;

  const locationLine = gps
    ? `You provided a location: ${gps}. That helps, but I am still not fully sure.`
    : 'No location was provided, so the description stays cautious.';

  const noteLine = notes
    ? `Your note: ${notes}.`
    : 'No extra notes were provided.';

  return {
    title: 'Uncertain structure or artwork',
    confidence: 'low',
    category: 'ordinary structure',
    quick_reason: 'I can see a photo, but no vision model is connected, so this is a cautious placeholder.',
    short_explanation:
      'This app is ready to format a short, clear cultural guide, but it does not yet run image recognition. The response stays honest and minimal until a vision model is connected.',
    why_here: `${locationLine} ${noteLine}`,
    audio_guide:
      'I can see you have a photo, but I am not analyzing it yet. Connect a vision model and I will describe what you are looking at in a short, calm way.',
    tip: 'If you can, add GPS or a short note to help identify the place.',
  };
}

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [gps, setGps] = useState('');
  const [notes, setNotes] = useState('');
  const [response, setResponse] = useState(EMPTY_JSON);

  const jsonOutput = useMemo(() => JSON.stringify(response, null, 2), [response]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to pick an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow camera access to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const analyze = () => {
    if (!imageUri) {
      Alert.alert('No photo', 'Add a photo first.');
      setResponse(EMPTY_JSON);
      return;
    }

    setResponse(
      buildResponse({
        hasImage: true,
        gps: gps.trim(),
        notes: notes.trim(),
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>City Photo Guide</Text>
        <Text style={styles.subtitle}>
          Add a photo and optional location to get a short, honest cultural guide in JSON.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick from Library</Text>
          </Pressable>
        </View>

        <View style={styles.previewBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <Text style={styles.previewPlaceholder}>No image selected</Text>
          )}
        </View>

        <Text style={styles.label}>GPS (optional)</Text>
        <TextInput
          value={gps}
          onChangeText={setGps}
          placeholder="Example: 48.8584, 2.2945"
          placeholderTextColor="#7A7A7A"
          style={styles.input}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Example: bronze statue near a river"
          placeholderTextColor="#7A7A7A"
          style={[styles.input, styles.notesInput]}
          multiline
        />

        <Pressable style={styles.primaryButton} onPress={analyze}>
          <Text style={styles.primaryButtonText}>Generate JSON</Text>
        </Pressable>

        <Text style={styles.outputLabel}>Output (JSON)</Text>
        <TextInput
          value={jsonOutput}
          style={styles.output}
          multiline
          editable={false}
          textAlignVertical="top"
        />

        <Text style={styles.footer}>
          This demo does not run image recognition yet. Connect a vision model API to produce real results.
        </Text>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F4EF',
  },
  container: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1A17',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4A4542',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B9B1A8',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#2F2A26',
    fontWeight: '600',
  },
  previewBox: {
    backgroundColor: '#ECE6DE',
    borderRadius: 14,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    color: '#6B6560',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4542',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#D5CFC6',
    color: '#1F1A17',
  },
  notesInput: {
    minHeight: 70,
  },
  primaryButton: {
    backgroundColor: '#1F1A17',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#F7F4EF',
    fontWeight: '700',
  },
  outputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A4542',
    marginTop: 4,
  },
  output: {
    minHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5CFC6',
    padding: 12,
    color: '#1F1A17',
    fontFamily: 'Courier',
  },
  footer: {
    fontSize: 12,
    color: '#6B6560',
    lineHeight: 18,
    marginBottom: 10,
  },
});
