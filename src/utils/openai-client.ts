import OpenAI from "openai";

// Client to connect to DeepSeek API through OpenAI SDK
export const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '',
});

// Function to get chat completion from DeepSeek API
export async function getChatCompletion(messages: any[], options = {}) {
  try {
    // Check if dummy mode is enabled
    const useDummyMode = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true';
    
    if (useDummyMode) {
      console.log('Using dummy mode for API response (explicitly enabled in config)');
      return getDummyResponse();
    }
    
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      console.warn('DeepSeek API key not set!');
      return getDummyResponse();
    }

    try {
      const completion = await openai.chat.completions.create({
        messages,
        model: "deepseek-chat",
        temperature: 0.7,
        max_tokens: 1000,
        ...options
      });

      console.log('DeepSeek API response received');
      return completion.choices[0].message.content;
    } catch (apiError: any) {
      console.error('DeepSeek API call error:', apiError.message);
      
      // Check if it's a specific error status code
      if (apiError.response) {
        console.error('Status:', apiError.response.status);
        console.error('Data:', apiError.response.data);
        
        // Return dummy response for 503 and other errors
        console.log('API error occurred, falling back to dummy response');
      }
      
      return getDummyResponse();
    }
  } catch (error: any) {
    console.error('Error in getChatCompletion:', error.message);
    return getDummyResponse();
  }
}

// Dummy response (used when API key not configured)
function getDummyResponse() {
  return 'This is a dummy response because the DeepSeek API key is not configured or the API call failed. The API is either unavailable or your API key may be invalid. Smart cities utilize technologies like Internet of Things (IoT) sensors, AI-powered analytics, cloud computing, smart grids, autonomous vehicles, blockchain for secure transactions, and advanced connectivity solutions like 5G. These technologies help optimize traffic flow, reduce energy consumption, enhance public safety, improve waste management, and create more responsive urban environments.';
}

// Simple test function
export async function testDeepSeekConnection() {
  try {
    const response = await getChatCompletion([
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello, how are you?" }
    ]);
    
    console.log('Test response:', response);
    return response;
  } catch (error) {
    console.error('Connection test failed:', error);
    return 'Connection test failed';
  }
} 