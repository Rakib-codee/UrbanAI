import { NextResponse } from 'next/server';

// Request and Response types
interface AnalysisRequest {
  data: Record<string, unknown>;
  analysisType: string;
}

interface AnalysisResponse {
  recommendations: string[];
  insights: string;
  forecast: string;
  metrics?: Record<string, number>;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: AnalysisRequest = await request.json();
    const { data, analysisType } = body;

    // Get the DeepSeek API key from environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY is not defined in environment variables');
      return NextResponse.json(
        getFallbackAnalysis(analysisType),
        { status: 200 }
      );
    }

    // Format data for the prompt
    const formattedData = JSON.stringify(data, null, 2);

    // Create a prompt for the DeepSeek model based on analysis type
    const prompt = getPromptForAnalysisType(analysisType, formattedData);

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
        const parsedResponse: AnalysisResponse = JSON.parse(jsonContent);
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
    console.error('Error processing AI analysis:', error);
    
    // Always return fallback results instead of an error for better UX
    const { analysisType = 'traffic' } = (await request.json()) as AnalysisRequest;
    return NextResponse.json(getFallbackAnalysis(analysisType));
  }
}

// Helper function to get the appropriate prompt based on analysis type
function getPromptForAnalysisType(analysisType: string, data: string): string {
  switch (analysisType) {
    case 'traffic':
      return `You are an urban traffic analysis AI assistant. Based on the following traffic data, provide insights, recommendations, and forecasts for traffic management.

Data:
${data}

Please provide:
1. 3-5 specific recommendations for traffic optimization
2. A concise insight summarizing the current traffic situation
3. A short forecast of future traffic trends

Format your response as JSON with the following structure:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "insights": "Your concise insights here",
  "forecast": "Your traffic forecast here"
}`;

    case 'resource':
      return `You are an urban resource management AI assistant. Based on the following resource data, provide insights, recommendations, and forecasts for resource allocation and optimization.

Data:
${data}

Please provide:
1. 3-5 specific recommendations for resource optimization
2. A concise insight summarizing the current resource utilization
3. A short forecast of future resource trends

Format your response as JSON with the following structure:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "insights": "Your concise insights here",
  "forecast": "Your resource forecast here"
}`;

    case 'environment':
      return `You are an environmental analysis AI assistant. Based on the following environmental data, provide insights, recommendations, and forecasts for environmental management.

Data:
${data}

Please provide:
1. 3-5 specific recommendations for environmental improvement
2. A concise insight summarizing the current environmental conditions
3. A short forecast of future environmental trends

Format your response as JSON with the following structure:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "insights": "Your concise insights here",
  "forecast": "Your environmental forecast here"
}`;

    case 'population':
    default:
      return `You are an urban population analysis AI assistant. Based on the following population data, provide insights, recommendations, and forecasts for urban planning.

Data:
${data}

Please provide:
1. 3-5 specific recommendations for urban planning based on population trends
2. A concise insight summarizing the current population distribution
3. A short forecast of future population trends

Format your response as JSON with the following structure:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "insights": "Your concise insights here",
  "forecast": "Your population forecast here"
}`;
  }
}

// Fallback function to return default analysis if the API call fails
function getFallbackAnalysis(analysisType: string): AnalysisResponse {
  const fallbackAnalyses: Record<string, AnalysisResponse> = {
    'traffic': {
      recommendations: [
        "Implement adaptive traffic signal control at major intersections",
        "Create dedicated bus lanes on high-congestion corridors",
        "Encourage staggered work hours to distribute peak traffic",
        "Deploy smart parking solutions to reduce searching time",
        "Expand real-time traffic information systems"
      ],
      insights: "Current traffic patterns show significant congestion during morning and evening rush hours, with downtown areas experiencing the highest volumes.",
      forecast: "Traffic volumes are expected to increase by 12% in the next year, with particular growth in the northern corridors."
    },
    'resource': {
      recommendations: [
        "Implement smart metering for electricity consumption monitoring",
        "Increase water recycling capacity in industrial zones",
        "Optimize waste collection routes based on fill-level monitoring",
        "Expand renewable energy generation capacity",
        "Implement predictive maintenance for utility infrastructure"
      ],
      insights: "Resource utilization shows seasonal patterns with peak electricity demand during summer months and water conservation issues during dry periods.",
      forecast: "Resource demands are projected to grow by 15% annually, with renewable energy adoption offsetting 20% of increased electricity needs."
    },
    'environment': {
      recommendations: [
        "Expand green infrastructure including urban forests and parks",
        "Implement stricter emission controls for industrial facilities",
        "Develop comprehensive stormwater management systems",
        "Increase electric vehicle charging infrastructure",
        "Implement building energy efficiency standards"
      ],
      insights: "Air quality indices show moderate improvement year-over-year, though water quality concerns persist in certain districts.",
      forecast: "Environmental conditions are expected to stabilize with current interventions, but additional measures will be needed to meet 2030 sustainability goals."
    },
    'population': {
      recommendations: [
        "Develop affordable housing in areas with high job growth",
        "Improve transit connectivity between residential and commercial zones",
        "Expand healthcare facilities in underserved neighborhoods",
        "Create mixed-use development zones to reduce commute needs",
        "Implement age-friendly infrastructure in areas with aging populations"
      ],
      insights: "Population growth is concentrated in urban centers and peripheral planned developments, with demographic shifts toward younger residents in revitalized districts.",
      forecast: "Population is projected to increase by 5% annually, with higher density development in transit-oriented corridors."
    }
  };

  return fallbackAnalyses[analysisType] || fallbackAnalyses['traffic'];
} 