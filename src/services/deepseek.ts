import axios, { AxiosError } from 'axios';

// DeepSeek API type definitions
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
};

export type ChatResponse = {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// Detect language of a text
export function detectLanguage(text: string): string {
  // Simple language detection
  // Check for non-Latin characters common in different languages
  const languages = [
    { name: 'bangla', regex: /[\u0980-\u09FF]/ }, // Bengali/Bangla
    { name: 'hindi', regex: /[\u0900-\u097F]/ },  // Hindi
    { name: 'arabic', regex: /[\u0600-\u06FF]/ }, // Arabic
    { name: 'chinese', regex: /[\u4E00-\u9FFF]/ }, // Chinese
    { name: 'japanese', regex: /[\u3040-\u30FF]/ }, // Japanese
    { name: 'korean', regex: /[\uAC00-\uD7AF]/ },  // Korean
    { name: 'thai', regex: /[\u0E00-\u0E7F]/ },    // Thai
    { name: 'russian', regex: /[\u0400-\u04FF]/ }  // Cyrillic/Russian
  ];
  
  for (const lang of languages) {
    if (lang.regex.test(text)) {
      return lang.name;
    }
  }
  
  return 'english'; // Default to English
}

// Get dummy response for testing when API key is not available
function getDummyResponse(messages: ChatMessage[]): ChatResponse {
  // Find the last user message
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
  
  let responseContent = '';
  
  // Check the user's message to provide a somewhat relevant response
  if (lastUserMessage) {
    const userMessage = lastUserMessage.content.toLowerCase();
    
    if (userMessage.includes('smart city') || userMessage.includes('urban')) {
      responseContent = 'Smart cities utilize various technologies including IoT sensors, AI analytics, cloud computing, and 5G connectivity to improve urban infrastructure. These technologies help optimize traffic flow, reduce energy consumption, and create more sustainable urban environments. Urban planning in smart cities focuses on creating people-centric spaces that leverage technology to enhance quality of life while addressing challenges like population growth and climate change.';
    }
    else if (userMessage.includes('traffic') || userMessage.includes('transportation')) {
      responseContent = 'Traffic management in modern cities employs AI-powered systems that analyze real-time data from cameras, sensors, and connected vehicles. These systems can automatically adjust traffic light timing, suggest alternate routes during congestion, and prioritize emergency vehicles. Future transportation planning increasingly incorporates autonomous vehicles, micro-mobility options, and multimodal transit systems to reduce congestion and emissions.';
    }
    else if (userMessage.includes('energy') || userMessage.includes('sustainability')) {
      responseContent = 'Sustainable urban development utilizes renewable energy sources, energy-efficient buildings, and smart grid technology to reduce carbon footprints. Cities are implementing solar panels, wind turbines, and energy storage systems integrated with AI-powered management systems. Green building standards focus on reducing energy consumption while improving comfort through advanced insulation, natural lighting, and efficient HVAC systems.';
    }
    else {
      responseContent = 'Thank you for your question about urban planning. This is a dummy response being used because the DeepSeek API is currently configured to use dummy mode. In a real implementation, this would connect to the AI model to provide specific answers to your questions about urban planning, smart cities, sustainability, or other related topics.';
    }
  } else {
    responseContent = 'This is a dummy response. Please ask a specific question about urban planning or smart cities to get more targeted information.';
  }
  
  return {
    id: 'dummy-response-id',
    model: 'dummy-model',
    object: 'chat.completion',
    created: Date.now(),
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: responseContent
        },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  };
}

// Function to call DeepSeek API
export async function callDeepSeekAPI(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '';
    const useDummyMode = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true';
    
    console.log('API Key available:', apiKey ? 'Yes (ending with ' + apiKey.slice(-5) + ')' : 'No');
    console.log('Dummy mode enabled:', useDummyMode);
    
    // Use dummy mode if explicitly enabled in .env.local
    if (useDummyMode) {
      console.log('Using dummy mode for API response (explicitly enabled)');
      return getDummyResponse(messages);
    }
    
    // Check API key validity
    if (!apiKey || apiKey === 'your_deepseek_api_key') {
      console.error('DeepSeek API key is missing or invalid. Using dummy mode instead.');
      return getDummyResponse(messages);
    }
    
    // Check if user is asking in a different language
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    const userLanguage = lastUserMessage ? detectLanguage(lastUserMessage.content) : 'english';
    
    // Find system message to modify
    const systemMessageIndex = messages.findIndex(msg => msg.role === 'system');
    
    if (systemMessageIndex !== -1) {
      let languageInstruction = '';
      
      if (userLanguage === 'bangla') {
        languageInstruction = `
The user is communicating in Bengali (Bangla). Please respond in Bengali language.
Format your Bengali responses clearly with:
- Use proper Bangla punctuation and grammar
- Use bullet points (•) for lists
- Keep paragraphs short and clear
- Use headings when appropriate`;
      } else if (userLanguage !== 'english') {
        // For other non-English languages
        languageInstruction = `
The user is communicating in a non-English language. Please detect their language and respond in the SAME language.
Format your responses clearly and maintain the same language throughout your response.`;
      } else {
        // Default English instructions
        languageInstruction = `
Respond in English by default. However, if the user communicates in another language, detect it and respond in that same language.
Format your responses clearly with:
- Proper grammar and punctuation
- Bullet points for lists
- Short, clear paragraphs
- Appropriate headings when useful`;
      }
      
      // Update system message with language instruction
      messages[systemMessageIndex].content += languageInstruction;
    }

    console.log('Sending request to DeepSeek API...');
    
    try {
      const response = await axios.post<ChatResponse>(
        'https://api.deepseek.com/v1/chat/completions',
        {
          messages,
          model: 'deepseek-chat',
          temperature: 0.7,
          max_tokens: 1000,
          stream: false, // Streaming simulated on client side
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log('DeepSeek API response received successfully');
      return response.data;
    } catch (apiError: unknown) {
      const error = apiError as AxiosError;
      console.error('DeepSeek API direct error:', error.message);
      console.error('Status code:', error.response?.status);
      
      // Always fall back to dummy response for any API error
      console.log('API error occurred, falling back to dummy response');
      return getDummyResponse(messages);
    }
  } catch (error: unknown) {
    console.error('DeepSeek API call error:', (error as Error).message);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as AxiosError;
      console.error('Status:', axiosError.response?.status);
      console.error('Data:', axiosError.response?.data);
    }
    
    // For any type of error, return dummy response
    return getDummyResponse(messages);
  }
}

// Urban Planning prompt template (system message)
export const URBAN_PLANNING_SYSTEM_PROMPT = 
`You are a versatile AI Assistant with expertise in many areas including urban planning, general knowledge, science, technology, arts, and more.

While you have special knowledge in urban planning topics like:
- Urban planning principles and best practices
- Zoning regulations and land use
- Traffic flow optimization and transportation planning
- Sustainable urban development
- Smart city technologies and infrastructure

You can also answer questions about:
- General knowledge and facts
- Science and technology
- History and culture
- Arts and entertainment
- Business and economics
- Health and wellness
- And many other topics

Provide helpful, accurate, and thoughtful responses to any question the user asks.
Always be respectful, informative, and engaging in your answers.
If you don't know the answer to a specific question, acknowledge that and suggest where the user might find that information.

IMPORTANT: If the user is communicating in Bengali (Bangla) or any other non-English language, respond in the SAME language.`;

// User session type
export type UserSession = {
  userId: string;
  messages: ChatMessage[];
};

// Memory cache (use database in production)
const sessionCache = new Map<string, UserSession>();

// Get or create user session
export function getUserSession(userId: string): UserSession {
  if (!sessionCache.has(userId)) {
    // Create new session
    sessionCache.set(userId, {
      userId,
      messages: [
        { role: 'system', content: URBAN_PLANNING_SYSTEM_PROMPT }
      ]
    });
  }
  
  return sessionCache.get(userId)!;
}

// Save chat message
export function saveUserMessage(userId: string, message: string): void {
  const session = getUserSession(userId);
  session.messages.push({ role: 'user', content: message });
}

// Save AI response
export function saveAssistantResponse(userId: string, response: string): void {
  const session = getUserSession(userId);
  session.messages.push({ role: 'assistant', content: response });
}

// Reset user session
export function resetUserSession(userId: string): void {
  sessionCache.set(userId, {
    userId,
    messages: [
      { role: 'system', content: URBAN_PLANNING_SYSTEM_PROMPT }
    ]
  });
}

// Get all sessions (for admin purposes)
export function getAllSessions(): UserSession[] {
  return Array.from(sessionCache.values());
} 