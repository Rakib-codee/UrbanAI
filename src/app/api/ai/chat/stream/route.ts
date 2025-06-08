import { NextRequest } from 'next/server';
import { ChatMessage, URBAN_PLANNING_SYSTEM_PROMPT } from '@/services/deepseek';

export const runtime = 'edge'; // Edge runtime for streaming support

// Edge-compatible mock session function
async function getMockSession() {
  return {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'user@example.com',
      image: 'https://i.pravatar.cc/150?u=user@example.com'
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    // Get the user session using mock session for Edge compatibility
    const session = await getMockSession();
    
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Login required to use this API' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();

    // Validate message
    if (!body.message || typeof body.message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Bad Request: Message is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Prepare messages for DeepSeek API
      const messages: ChatMessage[] = [
        { 
          role: 'system', 
          content: URBAN_PLANNING_SYSTEM_PROMPT
        }
      ];
      
      // Add history if provided
      if (body.history && Array.isArray(body.history)) {
        body.history.forEach((msg: {role: string, content: string}) => {
          if (msg.role && msg.content && (msg.role === 'user' || msg.role === 'assistant')) {
            messages.push({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            });
          }
        });
      }
      
      // Add current message
      messages.push({ role: 'user', content: body.message });
      
      // Get API key for direct streaming
      const apiKey = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '';
      
      // Use dummy mode if explicitly enabled or API key is missing
      const useDummyMode = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true' || 
                           !apiKey || 
                           apiKey === 'your_deepseek_api_key';
      
      if (useDummyMode) {
        // For dummy mode, simulate streaming with a delay
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const dummyResponse = getDummyStreamResponse(body.message);
            const chunks = dummyResponse.split(' ');
            
            for (const chunk of chunks) {
              controller.enqueue(encoder.encode(chunk + ' '));
              // Add a small delay between chunks to simulate streaming
              await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
      
      // For real API, create a streaming response
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages,
          model: 'deepseek-chat',
          temperature: 0.7,
          max_tokens: 1000,
          stream: true,
        }),
      });
      
      // Create a custom transform stream to handle the SSE format from DeepSeek API
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          // Convert the chunk to text
          const text = new TextDecoder().decode(chunk);
          
          // Process each line (SSE format sends data as lines starting with "data: ")
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            // Skip the "data: " prefix and parse the JSON
            if (line.startsWith('data: ')) {
              const jsonData = line.slice(6); // Remove "data: " prefix
              
              // Check if it's the [DONE] message
              if (jsonData.trim() === '[DONE]') continue;
              
              try {
                const data = JSON.parse(jsonData);
                const content = data.choices[0]?.delta?.content || '';
                
                if (content) {
                  // Send the content as a UTF-8 encoded chunk
                  controller.enqueue(new TextEncoder().encode(content));
                }
              } catch (error) {
                console.error('Error parsing SSE message:', error);
              }
            }
          }
        }
      });
      
      // Pipe the response through our transform stream
      return new Response(response.body?.pipeThrough(transformStream), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Content-Type-Options': 'nosniff',
        },
      });
      
    } catch (error: unknown) {
      console.error('AI service error:', (error as Error).message);
      return new Response(
        JSON.stringify({ error: 'AI service error. Please try again later.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: unknown) {
    console.error('Internal server error:', (error as Error).message);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to generate dummy streaming responses
function getDummyStreamResponse(message: string): string {
  const userMessage = message.toLowerCase();
  
  if (userMessage.includes('smart city') || userMessage.includes('urban')) {
    return 'Smart cities utilize various technologies including IoT sensors, AI analytics, cloud computing, and 5G connectivity to improve urban infrastructure. These technologies help optimize traffic flow, reduce energy consumption, and create more sustainable urban environments. Urban planning in smart cities focuses on creating people-centric spaces that leverage technology to enhance quality of life while addressing challenges like population growth and climate change.';
  }
  else if (userMessage.includes('traffic') || userMessage.includes('transportation')) {
    return 'Traffic management in modern cities employs AI-powered systems that analyze real-time data from cameras, sensors, and connected vehicles. These systems can automatically adjust traffic light timing, suggest alternate routes during congestion, and prioritize emergency vehicles. Future transportation planning increasingly incorporates autonomous vehicles, micro-mobility options, and multimodal transit systems to reduce congestion and emissions.';
  }
  else if (userMessage.includes('energy') || userMessage.includes('sustainability')) {
    return 'Sustainable urban development utilizes renewable energy sources, energy-efficient buildings, and smart grid technology to reduce carbon footprints. Cities are implementing solar panels, wind turbines, and energy storage systems integrated with AI-powered management systems. Green building standards focus on reducing energy consumption while improving comfort through advanced insulation, natural lighting, and efficient HVAC systems.';
  }
  else {
    return 'Thank you for your question about urban planning. This is a dummy response being used because the DeepSeek API is currently configured to use dummy mode. In a real implementation, this would connect to the AI model to provide specific answers to your questions about urban planning, smart cities, sustainability, or other related topics.';
  }
} 