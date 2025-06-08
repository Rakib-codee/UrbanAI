import OpenAI from "openai";

// Setup for using DeepSeek Reasoner model
export const deepseekClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || ''
});

// Function to get response from DeepSeek Reasoner model
export async function getReasonerResponse(messages: any[]) {
  try {
    // Check if dummy mode is enabled
    const useDummyMode = process.env.NEXT_PUBLIC_USE_DUMMY_API === 'true';
    
    if (useDummyMode) {
      console.log('Using dummy mode for Reasoner API (explicitly enabled in config)');
      return { 
        content: getDummyContent(), 
        reasoningContent: getDummyReasoning() 
      };
    }
    
    if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
      console.warn('DeepSeek API key is not set!');
      return { 
        content: getDummyContent(), 
        reasoningContent: 'Cannot display reasoning because API key is not set.' 
      };
    }

    try {
      const response = await deepseekClient.chat.completions.create({
        model: "deepseek-reasoner",
        messages,
        stream: true
      });

      let reasoningContent = "";
      let content = "";

      for await (const chunk of response) {
        if (chunk.choices[0].delta.reasoning_content) {
          reasoningContent += chunk.choices[0].delta.reasoning_content;
        } else if (chunk.choices[0].delta.content) {
          content += chunk.choices[0].delta.content;
        }
      }

      return { content, reasoningContent };
    } catch (apiError: any) {
      console.error('DeepSeek Reasoner API call error:', apiError.message);
      if (apiError.response) {
        console.error('Status:', apiError.response.status);
        console.error('Data:', apiError.response.data);
      }
      
      console.log('API error occurred, using dummy reasoner response');
      return { 
        content: getDummyContent(), 
        reasoningContent: 'Cannot display reasoning due to API call error.' 
      };
    }
  } catch (error: any) {
    console.error('General error in getReasonerResponse:', error.message);
    return { 
      content: getDummyContent(), 
      reasoningContent: 'Cannot display reasoning due to an unexpected error.' 
    };
  }
}

// Dummy content response
function getDummyContent() {
  return '9.11 is greater than 9.8.';
}

// Dummy reasoning response
function getDummyReasoning() {
  return `Let's compare 9.11 and 9.8.

9.11 = 9 + 0.11
9.8 = 9 + 0.8

Since 0.8 is greater than 0.11 (because 8/10 > 11/100), we have 9.8 > 9.11.

Wait, I made a mistake in my calculation. Let me recalculate:

9.11 = 9 + 0.11 = 9 + 11/100
9.8 = 9 + 0.8 = 9 + 8/10 = 9 + 80/100

Now I can see that 80/100 > 11/100, so 9.8 > 9.11.

Actually, I made another error. Let me be more careful:
9.11 is in the hundredths place, so it's 9 11/100
9.8 is in the tenths place, so it's 9 8/10 = 9 80/100

Since 80/100 > 11/100, we have 9.8 > 9.11.

Therefore, 9.8 is greater than 9.11.

Actually, I made an error again. Let me double-check:
9.11 = 9 + 11/100
9.8 = 9 + 8/10 = 9 + 80/100

Now comparing 11/100 and 80/100, we can see that 80/100 > 11/100.
Therefore, 9.8 > 9.11.

Wait, I need to be extra careful with the decimal representation:
- 9.11 represents 9 + 1/10 + 1/100 = 9.11
- 9.8 represents 9 + 8/10 = 9.80

Comparing these two numbers:
9.80 > 9.11

Therefore, 9.8 is greater than 9.11.

Wait, I need to be extra careful with the decimal representation:
- 9.11 represents 9 + 1/10 + 1/100 = 9.11
- 9.8 represents 9 + 8/10 = 9.80

Comparing these two numbers:
9.80 > 9.11

Therefore, 9.8 is greater than 9.11.`;
}

// Example usage
export async function runDeepseekReasoner() {
  try {
    // First round
    const messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}];
    const response = await getReasonerResponse(messages);
    
    console.log("Reasoning:", response.reasoningContent);
    console.log("Answer:", response.content);
    
    // Second round (continuing previous conversation)
    messages.push({"role": "assistant", "content": response.content});
    messages.push({"role": "user", "content": "How many Rs are there in the word 'strawberry'?"});
    
    const response2 = await getReasonerResponse(messages);
    
    console.log("Reasoning (Round 2):", response2.reasoningContent);
    console.log("Answer (Round 2):", response2.content);
    
    return {
      round1: { reasoning: response.reasoningContent, answer: response.content },
      round2: { reasoning: response2.reasoningContent, answer: response2.content }
    };
  } catch (error) {
    console.error("DeepSeek Reasoner test error:", error);
    return { error: "Error using DeepSeek Reasoner" };
  }
} 