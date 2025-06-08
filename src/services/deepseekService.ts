import axios from 'axios';

// DeepSeek API endpoint and key
const DEEPSEEK_API_URL = process.env.NEXT_PUBLIC_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

// Interface for the city traffic data that will be sent to DeepSeek
interface CityTrafficData {
  city: string;
  country?: string;
  congestionRate: number;
  averageSpeed: number;
  peakHours: {
    morning: string;
    evening: string;
  };
  trafficPatterns: {
    name: string; // hour or day
    value: number; // traffic level
  }[];
  incidents: {
    location: string;
    type: string;
    severity: string;
  }[];
}

// Interface for DeepSeek response
interface DeepSeekRecommendation {
  recommendations: string[];
  explanation: string;
  futureImpact: string;
}

/**
 * DeepSeek AI service for traffic analysis and recommendations
 */
const DeepSeekService = {
  /**
   * Generate traffic recommendations using DeepSeek AI
   * @param cityData Traffic data for the specific city
   * @returns Array of personalized recommendations
   */
  async getTrafficRecommendations(cityData: CityTrafficData): Promise<string[]> {
    try {
      // If DeepSeek API key is not set, return fallback recommendations
      if (!DEEPSEEK_API_KEY) {
        console.warn('DEEPSEEK_API_KEY not set. Using fallback recommendations.');
        return DeepSeekService.getFallbackRecommendations(cityData);
      }
      
      // Prepare prompt for DeepSeek AI
      const prompt = DeepSeekService.generatePrompt(cityData);
      
      // Call DeepSeek API
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a traffic management expert specializing in urban transportation systems and smart city solutions. Your task is to analyze traffic data and provide specific, actionable recommendations for improving traffic flow and reducing congestion.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          }
        }
      );
      
      // Parse DeepSeek response
      const aiResponse = response.data.choices[0].message.content;
      
      try {
        // Try to parse as JSON
        const parsedResponse: DeepSeekRecommendation = JSON.parse(aiResponse);
        return parsedResponse.recommendations;
      } catch (parseError) {
        // If parsing fails, extract recommendations from text
        console.warn('Failed to parse DeepSeek response as JSON, extracting manually', parseError);
        return DeepSeekService.extractRecommendationsFromText(aiResponse);
      }
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      // Return fallback recommendations in case of error
      return DeepSeekService.getFallbackRecommendations(cityData);
    }
  },
  
  /**
   * Generate a detailed prompt for the AI based on city traffic data
   */
  generatePrompt(cityData: CityTrafficData): string {
    return `
Please analyze the following traffic data for ${cityData.city} and provide 4-5 specific, actionable recommendations to improve traffic flow and reduce congestion.

TRAFFIC DATA:
- City: ${cityData.city}${cityData.country ? `, ${cityData.country}` : ''}
- Current Congestion Rate: ${cityData.congestionRate}%
- Average Traffic Speed: ${cityData.averageSpeed} km/h
- Morning Peak Hours: ${cityData.peakHours.morning}
- Evening Peak Hours: ${cityData.peakHours.evening}

${cityData.incidents.length > 0 ? `
CURRENT TRAFFIC INCIDENTS:
${cityData.incidents.map(incident => `- ${incident.type} (${incident.severity}) at ${incident.location}`).join('\n')}
` : ''}

Based on this data, please provide:
1. 4-5 specific, actionable recommendations for improving traffic flow in ${cityData.city}
2. For each recommendation, explain its potential impact
3. Prioritize recommendations based on feasibility and impact

Please format your response as a JSON object with the following structure:
{
  "recommendations": [
    "First recommendation",
    "Second recommendation",
    "Third recommendation",
    "Fourth recommendation",
    "Fifth recommendation (optional)"
  ],
  "explanation": "Brief overall explanation of your analysis",
  "futureImpact": "Brief statement about future traffic outlook if recommendations are implemented"
}

Focus on practical solutions that can be implemented by city planners and traffic authorities.
    `;
  },
  
  /**
   * Extract recommendations from text when JSON parsing fails
   */
  extractRecommendationsFromText(text: string): string[] {
    // Look for numbered lists or bullet points
    const recommendationRegex = /\d+\.\s+(.+?)(?=\n\d+\.|\n\n|\n$|$)/g;
    const bulletRegex = /[•\-\*]\s+(.+?)(?=\n[•\-\*]|\n\n|\n$|$)/g;
    
    // Try to find numbered recommendations
    const numberedMatches = [...text.matchAll(recommendationRegex)];
    if (numberedMatches.length >= 3) {
      return numberedMatches.map(match => match[1].trim());
    }
    
    // Try to find bulleted recommendations
    const bulletMatches = [...text.matchAll(bulletRegex)];
    if (bulletMatches.length >= 3) {
      return bulletMatches.map(match => match[1].trim());
    }
    
    // If structured extraction fails, split by newlines and take lines that look like recommendations
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 20 && line.length < 200 && !line.includes('{') && !line.includes('}'));
    
    if (lines.length >= 3) {
      return lines.slice(0, 5);
    }
    
    // If all else fails, return generic recommendations
    return [
      "Implement smart traffic light systems at major intersections",
      "Expand public transportation options during peak hours",
      "Develop alternate routes for high-congestion areas",
      "Create dedicated lanes for public transportation"
    ];
  },
  
  /**
   * Provide fallback recommendations when API call fails
   */
  getFallbackRecommendations(cityData: CityTrafficData): string[] {
    // Congestion-based recommendations
    const highCongestionRecs = [
      `Implement congestion pricing in ${cityData.city} downtown area during peak hours (${cityData.peakHours.morning} and ${cityData.peakHours.evening})`,
      `Develop park-and-ride facilities at ${cityData.city} perimeter with express shuttle service`,
      `Create HOV lanes on major highways entering ${cityData.city}`,
      `Stagger work hours for government offices and encourage private businesses to do the same`
    ];
    
    const mediumCongestionRecs = [
      `Optimize traffic signal timing at major intersections in ${cityData.city}`,
      `Increase public transportation frequency on high-demand routes during ${cityData.peakHours.morning} and ${cityData.peakHours.evening}`,
      `Implement smart parking solutions to reduce search traffic in ${cityData.city} center`,
      `Develop a comprehensive bicycle lane network to encourage alternative transportation`
    ];
    
    const lowCongestionRecs = [
      `Maintain current traffic management systems with regular optimization`,
      `Develop predictive traffic management using historical data patterns`,
      `Improve pedestrian infrastructure to encourage walking for short trips in ${cityData.city}`,
      `Implement preventative maintenance program to avoid road closures during peak hours`
    ];
    
    // Choose recommendations based on congestion level
    if (cityData.congestionRate > 70) {
      return highCongestionRecs;
    } else if (cityData.congestionRate > 40) {
      return mediumCongestionRecs;
    } else {
      return lowCongestionRecs;
    }
  }
};

export default DeepSeekService; 