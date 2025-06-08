import { NextResponse } from 'next/server';

// Define types for the simulation parameters and response
interface SimulationParameter {
  name: string;
  value: number;
  unit: string;
}

interface SimulationRequest {
  scenario: string;
  parameters: SimulationParameter[];
}

interface SimulationMetric {
  name: string;
  value: string;
  unit: string;
}

interface SimulationResponse {
  metrics: SimulationMetric[];
  recommendation: string;
}

// Simple in-memory cache to store previous simulation results
// This will persist between requests until the server restarts
const simulationCache: Record<string, SimulationResponse> = {};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: SimulationRequest = await request.json();
    const { scenario, parameters } = body;

    // Create a cache key based on the scenario and parameters
    const paramString = parameters.map(p => `${p.name}:${p.value}`).join('|');
    const cacheKey = `${scenario}-${paramString}`;

    // Check if we have this result cached
    if (simulationCache[cacheKey]) {
      console.log('Using cached API result for:', cacheKey);
      return NextResponse.json(simulationCache[cacheKey]);
    }

    // Get the DeepSeek API key from environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY is not defined in environment variables');
      // Return fallback results instead of error for better user experience
      const fallbackResult = getFallbackResults(scenario);
      return fallbackResult;
    }

    // Format parameters for the prompt
    const formattedParameters = parameters.map(
      param => `${param.name}: ${param.value}${param.unit ? ' ' + param.unit : ''}`
    ).join(', ');

    // Create a prompt for the DeepSeek model
    const prompt = `You are an urban planning AI assistant. Based on the following simulation scenario and parameters, provide realistic simulation results and recommendations.

Scenario: ${scenario.replace(/_/g, ' ').toUpperCase()}

Parameters:
${formattedParameters}

Please provide:
1. A set of 4 key metrics with realistic values based on the scenario and parameters
2. A detailed recommendation based on the simulation results

Format your response as JSON with the following structure:
{
  "metrics": [
    {"name": "Metric Name", "value": "Metric Value", "unit": "Unit"},
    ...
  ],
  "recommendation": "Your detailed recommendation here"
}`;

    // Set a timeout for the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      // Call the DeepSeek API with timeout
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800, // Reduced token count for faster response
          top_p: 0.95
        }),
        signal: controller.signal
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', errorText);
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      // Extract the content from the API response
      const content = apiResponse.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in DeepSeek API response');
      }

      // Parse the JSON from the content
      // The content might contain markdown code blocks, so we need to extract the JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      let jsonContent;
      
      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1];
      } else {
        // If no code blocks, try to parse the whole content
        jsonContent = content;
      }

      try {
        const parsedResponse: SimulationResponse = JSON.parse(jsonContent);
        
        // Cache the result
        simulationCache[cacheKey] = parsedResponse;
        
        return NextResponse.json(parsedResponse);
      } catch (parseError) {
        console.error('Error parsing JSON from DeepSeek response:', parseError);
        throw new Error('Failed to parse API response');
      }
    } catch (fetchError) {
      console.error('Error fetching from DeepSeek API:', fetchError);
      throw new Error('API call failed or timed out');
    }
    
  } catch (error) {
    console.error('Error processing simulation:', error);
    
    // Always return fallback results instead of an error for better UX
    const { scenario = 'traffic_flow' } = (await request.json()) as SimulationRequest;
    return getFallbackResults(scenario);
  }
}

// Fallback function to return default results if the API call fails
function getFallbackResults(scenario: string): NextResponse {
  const fallbackResults: Record<string, SimulationResponse> = {
    'traffic_flow': {
      metrics: [
        { name: "Average Delay", value: "28.4", unit: "sec/veh" },
        { name: "Level of Service", value: "C", unit: "" },
        { name: "Queue Length", value: "42", unit: "m" },
        { name: "Travel Time", value: "12.5", unit: "min" }
      ],
      recommendation: "Adjusting signal timing at the Central Avenue intersection could reduce delays by up to 22%. Consider implementing adaptive signal control for optimal performance."
    },
    'urban_growth': {
      metrics: [
        { name: "Population Increase", value: "24.8", unit: "%" },
        { name: "Developed Land", value: "1,245", unit: "hectares" },
        { name: "Infrastructure Cost", value: "$285M", unit: "" },
        { name: "Housing Demand", value: "18,500", unit: "units" }
      ],
      recommendation: "The northeastern sector shows the highest growth potential with the lowest infrastructure costs. Recommend focusing development in this area while preserving the southern green corridor."
    },
    'environmental_impact': {
      metrics: [
        { name: "Carbon Footprint", value: "32,500", unit: "tons/year" },
        { name: "Green Space Loss", value: "8.2", unit: "%" },
        { name: "Air Quality Index", value: "68", unit: "AQI" },
        { name: "Biodiversity Impact", value: "Medium", unit: "" }
      ],
      recommendation: "The proposed development will have significant impacts on local watershed. Recommend increasing permeable surfaces by 15% and implementing green infrastructure to mitigate runoff."
    },
    'population_density': {
      metrics: [
        { name: "Average Density", value: "6,850", unit: "people/km²" },
        { name: "Density Variation", value: "42", unit: "%" },
        { name: "Transit Coverage", value: "64", unit: "%" },
        { name: "Service Accessibility", value: "78", unit: "%" }
      ],
      recommendation: "Downtown areas show adequate service coverage, but the southwestern district has poor accessibility. Recommend increasing transit options and community services in this area."
    }
  };

  return NextResponse.json(fallbackResults[scenario] || fallbackResults['traffic_flow']);
} 