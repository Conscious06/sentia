# Cultural Lens

A React Native Expo app that identifies and explains cultural landmarks, historical sites, artworks, and monuments from photos.

## Features

- **Camera Capture**: Take photos directly within the app
- **Gallery Selection**: Choose existing photos from your device
- **AI-Powered Analysis**: Identifies cultural sites and provides rich context
- **Detailed Information**: Get history, architecture details, fun facts, and visitor tips
- **Audio-Ready Summaries**: Natural language summaries perfect for voiceovers
- **Confidence Levels**: Clear indication of identification certainty

## App Structure

```
CulturalLens/
├── App.tsx                    # Main navigation setup
├── app.json                   # Expo configuration and permissions
├── screens/
│   ├── HomeScreen.tsx         # Main menu and app introduction
│   ├── CameraScreen.tsx       # Camera capture functionality
│   ├── GalleryScreen.tsx      # Image picker from gallery
│   └── ResultsScreen.tsx      # Display analysis results
└── services/
    └── analysisService.ts     # Vision API integration
```

## Getting Started

### Prerequisites

- Node.js installed
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator, or a physical device with Expo Go

### Installation

1. Navigate to the project directory:
   ```bash
   cd CulturalLens
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (Mac only)
   - Press `w` for web
   - Scan QR code with Expo Go app on your phone

## Setting Up AI Vision Analysis

The app currently includes a demo mode. To enable real AI analysis, you need to connect it to a vision analysis service.

### Option 1: Create a Backend Service (Recommended)

1. Create a backend service (Node.js, Python, etc.) that:
   - Receives the image from the app
   - Calls a vision AI API (see options below)
   - Returns the analysis in the specified JSON format

2. Update `analysisService.ts` to call your backend:
   ```typescript
   async function callVisionAPI(imageDataUrl: string): Promise<CulturalAnalysis> {
     const response = await fetch('YOUR_BACKEND_ENDPOINT', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ image: imageDataUrl }),
     });
     return await response.json();
   }
   ```

### Option 2: Direct API Integration

For development/testing, you can integrate directly with vision APIs:

#### Claude API (Anthropic)

```typescript
async function analyzeWithClaude(base64Image: string): Promise<CulturalAnalysis> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': 'YOUR_API_KEY',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: createAnalysisPrompt(),
          },
        ],
      }],
    }),
  });

  const data = await response.json();
  const content = data.content[0].text;
  return JSON.parse(content);
}
```

#### GPT-4 Vision (OpenAI)

```typescript
async function analyzeWithGPT4(base64Image: string): Promise<CulturalAnalysis> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64Image}` },
          },
          {
            type: 'text',
            text: createAnalysisPrompt(),
          },
        ],
      }],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}
```

#### Google Cloud Vision

```typescript
async function analyzeWithGoogle(base64Image: string): Promise<CulturalAnalysis> {
  // First get landmarks with Vision API
  const visionResponse = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY`,
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'LANDMARK_DETECTION', maxResults: 5 }],
        }],
      }),
    }
  );

  const visionData = await visionResponse.json();
  const landmark = visionData.responses[0].landmarkAnnotations[0];

  // Then use a language model to generate detailed context
  // ... call GPT-4 or Claude with the landmark info
}
```

### Security Notes

- **Never expose API keys in client-side code** for production
- Use environment variables for development
- Create a backend service to handle API calls in production
- Implement rate limiting and authentication
- Consider using a service like AWS Lambda or Cloudflare Workers

## Expected Response Format

The AI should return JSON in this exact format:

```json
{
  "title": "Eiffel Tower",
  "confidence": "High",
  "one_liner": "An iron lattice tower and global icon of France",
  "overview": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris. Named after engineer Gustave Eiffel, it has become a global icon of France and one of the most recognizable structures in the world.",
  "history": "Built from 1887 to 1889 as the entrance to the 1889 World's Fair, it was initially criticized by some of France's leading artists and intellectuals. It was saved from demolition in 1909 when it was repurposed as a radio tower.",
  "architecture_or_art": "The tower's design is an example of Victorian engineering and industrial architecture. It stands 330 meters tall and was the tallest man-made structure in the world until 1930. The iron structure uses over 18,000 metal parts and 2.5 million rivets.",
  "fun_fact": "The tower actually grows in summer due to thermal expansion, gaining up to 15cm in height.",
  "visitor_tip": "Book tickets online in advance to skip the long queues. Sunset offers the best lighting for photos.",
  "audio_ready_summary": "This is the Eiffel Tower, Paris's most famous landmark and a global icon of France. Built for the 1889 World's Fair, this 330 meter iron tower was designed by Gustave Eiffel. Once controversial, it's now one of the most visited paid monuments in the world, receiving nearly 7 million visitors annually."
}
```

## Customization

### Styling

The app uses a color scheme inspired by classical architecture:
- Primary: `#2C3E50` (Dark Blue-Grey)
- Accent: `#E74C3C` (Red - for camera)
- Secondary: `#3498DB` (Blue - for gallery)
- Background: `#F5F6FA` (Light Grey)

Modify these colors in `screens/` files to match your preference.

### Features

To add new features:
1. Create new screens in `screens/`
2. Add navigation routes in `App.tsx`
3. Export the screen type in `RootStackParamList`

## Troubleshooting

### Camera not working
- Ensure permissions are granted in device settings
- Check that `app.json` includes proper permission descriptions
- Try on a physical device if emulator fails

### Gallery not accessible
- Grant photo library permissions in device settings
- Ensure there are photos in the device gallery

### Analysis not working
- Verify API keys are correct
- Check network connectivity
- Review console logs for error messages
- Ensure image format is supported (JPEG, PNG)

## Future Enhancements

- [ ] Offline mode with pre-downloaded landmark data
- [ ] Multi-language support
- [ ] Save and organize analyzed images
- [ ] Share analysis results
- [ ] Audio playback for summaries
- [ ] AR overlay mode
- [ ] Map integration showing nearby landmarks
- [ ] User-submitted information and corrections

## License

This project is open source and available for educational purposes.
