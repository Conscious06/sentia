# SENTIA

AI-powered cultural exploration app for iOS and Android.

## Overview

SENTIA is a context-aware, audio-first walking companion that explains places, art, architecture, and surroundings based on photos and user location.

**NOT a generic object recognition app** - SENTIA focuses on cultural context and meaning.

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript-ready** architecture (JSDoc types)
- **Clean Architecture** (MVVM)
- **expo-camera** - Camera access
- **expo-location** - GPS coordinates
- **expo-av** - Text-to-speech audio
- **@react-navigation** - Navigation
- **@react-native-async-storage** - Persistent storage

## Architecture

```
src/
├── components/          # UI components
│   ├── screens/        # Full-screen components
│   │   ├── CameraScreen.js
│   │   └── AnalysisScreen.js
│   └── ui/             # Reusable UI components
│       ├── AudioGuide.js
│       ├── NearbyDiscovery.js
│       └── PaywallSheet.js
├── services/           # Business logic layer
│   ├── api/           # API client & endpoints
│   │   ├── apiClient.js
│   │   ├── analyzeService.js
│   │   └── discoveryService.js
│   ├── storage/       # Data persistence
│   │   ├── storageService.js
│   │   └── premiumService.js
│   ├── location/      # GPS service
│   └── audio/         # TTS service
├── constants/         # Configuration
│   ├── categories.js  # Category definitions
│   ├── prompts.js     # AI prompts
│   └── config.js      # App configuration
├── types/            # Type definitions
└── utils/            # Utility functions
```

## Core Features

### 1. Camera-First Experience
- App opens directly to camera
- Minimal UI overlay
- Guidance text: "Works best with places, art, streets, and surroundings"

### 2. Relevance Gating
Before sending to AI:
- Lightweight relevance check
- Filters close-up objects (tables, walls, textures)
- Shows: "SENTIA needs a wider view to understand this place."

### 3. Category Classification
Images are classified into:
- `place_or_environment`
- `building_or_architecture`
- `artwork_or_painting`
- `sculpture_or_object`
- `unclear`

### 4. Category-Based AI Prompts
Each category uses a specialized prompt:
- **Places**: Context, atmosphere, cultural meaning
- **Architecture**: Name, period, function, significance
- **Artwork**: Artist, title, movement, biography

### 5. Honest Uncertainty
AI responses use "appears to be" or "likely" when not confident.
Never hallucinates facts.

### 6. Audio Guide (Premium)
- Apple TTS via expo-av
- 20-30 second spoken explanations
- Short, conversational sentences
- Auto-plays with headphones

### 7. Nearby Discovery (Premium)
- Up to 3 nearby cultural places
- Grouped by type: museum, city_exploration, walking_route
- No maps - discovery, not directions

### 8. Freemium Model
- **Free**: 3 scans per day
- **Premium**: Unlimited scans + audio + full discovery

## Setup

### Prerequisites
```bash
npm install
```

### Configuration

Edit `src/constants/config.js` to set your API endpoint:

```javascript
export const API_CONFIG = {
  baseURL: 'https://your-api.com/v1',
  // ...
};
```

### Run

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## API Integration

The app expects these endpoints:

### POST `/analyze/relevance`
Relevance check before main analysis.

**Request:**
```json
{
  "image": "base64_image",
  "prompt": "..."
}
```

**Response:**
```json
{
  "isRelevant": true,
  "reason": "..."
}
```

### POST `/analyze/category`
Category classification.

**Response:**
```json
{
  "category": "building_or_architecture",
  "confidence": "high"
}
```

### POST `/analyze/main`
Main cultural analysis.

**Response:**
```json
{
  "title": "Notre-Dame Cathedral",
  "confidence": "high",
  "category": "building_or_architecture",
  "quickReason": "Gothic cathedral from 12th century",
  "shortExplanation": "Masterpiece of French Gothic architecture...",
  "whyHere": "Historic and religious center of Paris...",
  "audioGuide": "This is Notre-Dame, a masterpiece...",
  "tip": "Visit at sunset for best light"
}
```

### POST `/discovery/nearby`
Nearby cultural places.

**Response:**
```json
{
  "suggestions": [
    {
      "name": "Musée d'Orsay",
      "type": "museum",
      "description": "World-famous Impressionist art collection",
      "distance": "5 min walk"
    }
  ]
}
```

## Premium Integration (TODO)

Currently, premium is a placeholder. For production:

1. **RevenueCat** (recommended):
   ```bash
   npm install react-native-purchases
   ```

2. **Or expo-store-commerce**:
   ```bash
   npx expo install expo-store-commerce
   ```

Update `src/services/storage/premiumService.js` with actual IAP logic.

## Development

### Adding New Categories

1. Add to `src/constants/categories.js`:
   ```javascript
   export const CATEGORIES = {
     YOUR_CATEGORY: 'your_category',
   };
   ```

2. Add prompt in `src/constants/prompts.js`:
   ```javascript
   export const buildYourCategoryPrompt = (location) => `...`;
   ```

3. Update `getAnalysisPrompt()` to route to your prompt.

### Debugging

Enable debug mode by importing from storage:

```javascript
import { debugStorage } from './src/services/storage';

// Get all stored data
const allData = await debugStorage.getAll();

// Reset scan limits
await debugStorage.resetLimits();

// Toggle premium for testing
await debugStorage.togglePremium();
```

## Design Principles

- Dark mode first
- Calm, premium tone
- Minimal UI
- Audio-first experience
- No AI jargon in UI

## File Structure Summary

| File | Purpose |
|------|---------|
| `App.js` | Entry point, navigation setup |
| `src/constants/prompts.js` | All AI prompts by category |
| `src/services/api/apiClient.js` | HTTP client with retries |
| `src/services/storage/premiumService.js` | Premium/paywall logic |
| `src/components/screens/CameraScreen.js` | Camera-first experience |
| `src/components/screens/AnalysisScreen.js` | Results display |
| `src/components/ui/AudioGuide.js` | TTS player component |

## License

Proprietary. All rights reserved.

---

Built with Expo SDK 54
