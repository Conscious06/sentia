import * as FileSystem from 'expo-file-system';
import type { CulturalAnalysis } from '../App';

/**
 * Analyzes an image using the vision MCP API
 * @param imageUri - The local URI of the image to analyze
 * @returns A CulturalAnalysis object with detailed information
 */
export async function analyzeImage(imageUri: string): Promise<CulturalAnalysis> {
  try {
    // Read the image and convert to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Determine image format
    const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

    // Create a data URL
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // For demo purposes, if we can't reach an API, return a mock response
    // In production, you would call your backend API here
    return await callVisionAPI(dataUrl);

  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw new Error('Failed to analyze image');
  }
}

/**
 * Calls the vision analysis API
 * In production, this should call your backend service which handles API keys securely
 */
async function callVisionAPI(imageDataUrl: string): Promise<CulturalAnalysis> {
  // IMPORTANT: In a production app, never expose API keys in client-side code
  // Instead, create a backend service that handles the API call

  // For demonstration purposes, we'll simulate an API response
  // Replace this with actual API call to your backend

  // Example of how you would call a real API:
  /*
  const response = await fetch('YOUR_BACKEND_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: imageDataUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  return data;
  */

  // Demo fallback - simulates API response
  return simulateAnalysis();
}

/**
 * Simulates an API response for demo purposes
 * In production, replace this with actual API calls
 */
function simulateAnalysis(): CulturalAnalysis {
  // This is a placeholder to show the structure
  // In production, the real API would return actual analysis data

  return {
    title: 'Demo: Cultural Heritage Site',
    confidence: 'Medium',
    one_liner: 'This appears to be a historically or culturally significant structure.',
    overview:
      'Without actual API analysis, I can provide general guidance. This app uses AI to identify ' +
      'buildings, monuments, artworks, and cultural landmarks. Connect to a vision analysis service ' +
      'to get real-time identification and historical context.',
    history:
      'Historical context depends on the specific site. Most cultural landmarks reflect the ' +
      'architectural styles, materials, and cultural values of their time period.',
    architecture_or_art:
      'Architectural analysis typically examines construction materials, style influences, ' +
      'decorative elements, and spatial organization to understand the creator\'s intentions.',
    fun_fact:
      'Many famous landmarks were built over multiple centuries, combining different architectural ' +
      'styles as they were expanded or renovated.',
    visitor_tip:
      'When visiting cultural sites, check opening hours in advance and consider guided tours ' +
      'for deeper historical context.',
    audio_ready_summary:
      'This is a demo response. To use the full functionality, connect this app to a vision ' +
      'analysis service. The app will then identify landmarks, artworks, and cultural sites from ' +
      'your photos, providing historical context and interesting facts about what you\'ve discovered.',
  };
}

/**
 * Parses API response into CulturalAnalysis format
 * This handles various response formats from different AI services
 */
function parseAPIResponse(response: any): CulturalAnalysis {
  // Handle different response formats
  if (response.analysis) {
    return response.analysis;
  }

  if (response.choices && response.choices[0]?.message?.content) {
    // OpenAI format
    const content = response.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, parse text response
      return parseTextResponse(content);
    }
  }

  // Fallback: try to extract from raw text
  return parseTextResponse(JSON.stringify(response));
}

/**
 * Parses unstructured text response into structured format
 */
function parseTextResponse(text: string): CulturalAnalysis {
  // Extract information using regex or simple parsing
  const titleMatch = text.match(/(?:title|name|identify):\s*([^\n.]+)/i);
  const title = titleMatch?.[1]?.trim() || 'Unknown Site';

  return {
    title,
    confidence: 'Medium',
    one_liner: 'Cultural or historical site identified from image analysis.',
    overview: text.substring(0, 500),
    history: 'Historical information not available in this response.',
    architecture_or_art: 'Architectural details not available in this response.',
    fun_fact: 'Additional facts would be provided with full API integration.',
    visitor_tip: 'Check local resources for visiting information.',
    audio_ready_summary: `This appears to be ${title}. For full details, ensure the app is connected to a vision analysis service.`,
  };
}

/**
 * Creates a prompt for AI analysis
 * Use this when calling AI services directly
 */
export function createAnalysisPrompt(): string {
  return `You are an expert cultural historian, architect, art historian, and travel guide.

Your role:
- Identify buildings, landmarks, historical sites, monuments, artworks, or culturally significant objects from images.
- Explain them in a clear, engaging, and accurate way.
- Adapt explanations so they are understandable for tourists, students, locals, and curious users simultaneously.

Rules:
- Never hallucinate facts. If uncertain, clearly state uncertainty with probability language.
- Prefer clarity over academic language.
- Be concise first, detailed second.
- Always prioritize factual correctness.

Analyze the image and respond ONLY with valid JSON in this exact format:
{
  "title": "Short clear name of the place or object",
  "confidence": "High / Medium / Low",
  "one_liner": "One sentence explaining why this place/object matters",
  "overview": "A short, friendly paragraph explaining what this is and why it is significant",
  "history": "Concise historical background (dates, period, origin)",
  "architecture_or_art": "If applicable, explain architectural style, art movement, materials, or design logic",
  "fun_fact": "One interesting or surprising fact",
  "visitor_tip": "Optional practical or cultural tip for visitors",
  "audio_ready_summary": "A natural 20-30 second spoken narration version of the explanation"
}

Keep language simple and engaging. Avoid emojis. Avoid academic jargon. Do not exceed 250 words total.`;
}
