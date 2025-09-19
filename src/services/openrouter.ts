// src/services/openrouter.ts
import OpenAI from 'openai';

// Debug environment variables
const debugEnv = () => {
  console.log('🔍 Environment Variables Debug:');
  console.log('VITE_OPENROUTER_API_KEY exists:', !!import.meta.env.VITE_OPENROUTER_API_KEY);
  console.log('VITE_OPENROUTER_API_KEY length:', import.meta.env.VITE_OPENROUTER_API_KEY?.length || 0);
  console.log('VITE_OPENROUTER_API_KEY starts with sk-or-v1:', import.meta.env.VITE_OPENROUTER_API_KEY?.startsWith('sk-or-v1-') || false);
  console.log('VITE_OPENROUTER_BASE_URL:', import.meta.env.VITE_OPENROUTER_BASE_URL);
  console.log('All env vars:', import.meta.env);
};

// Validate environment variables
const validateEnv = () => {
  debugEnv(); // Always debug first
  
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
    console.error('❌ VITE_OPENROUTER_API_KEY is not defined!');
    console.error('Please set your OpenRouter API key in Vercel environment variables:');
    console.error('1. Go to your Vercel dashboard');
    console.error('2. Select your project');
    console.error('3. Go to Settings > Environment Variables');
    console.error('4. Add VITE_OPENROUTER_API_KEY with your OpenRouter API key');
    console.error('5. Make sure to select ALL environments (Production, Preview, Development)');
    console.error('6. Click Save and then REDEPLOY your project');
    throw new Error('OpenRouter API key is not configured. Please check the console for setup instructions.');
  }
  
  if (import.meta.env.VITE_OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    console.error('❌ VITE_OPENROUTER_API_KEY is set to placeholder value!');
    console.error('Please replace with your actual OpenRouter API key.');
    throw new Error('OpenRouter API key is not properly configured. Please use your actual API key.');
  }

  if (!import.meta.env.VITE_OPENROUTER_API_KEY.startsWith('sk-or-v1-')) {
    console.error('❌ VITE_OPENROUTER_API_KEY format is incorrect!');
    console.error('OpenRouter API keys should start with "sk-or-v1-"');
    console.error('Your key starts with:', import.meta.env.VITE_OPENROUTER_API_KEY.substring(0, 10) + '...');
    throw new Error('OpenRouter API key format is incorrect. Keys should start with "sk-or-v1-"');
  }
};

// Only validate in browser environment
if (typeof window !== 'undefined') {
  validateEnv();
}

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app',
    "X-Title": "DataVision AI Chat",
  }
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

export class OpenRouterService {
  private static readonly MODEL = 'mistralai/mistral-7b-instruct:free';
  private static readonly SYSTEM_PROMPT = `You are a helpful AI assistant for DataVision AI, a data visualization and analytics platform. You help users with:

1. Data analysis and interpretation
2. Creating insights from charts and metrics
3. Explaining data trends and patterns
4. Providing recommendations based on data
5. General questions about data visualization and analytics

Be concise, helpful, and focus on actionable insights. If users ask about specific data they can't see, acknowledge the limitation and provide general guidance.`;

  static async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      // Add system message if not present
      const messagesWithSystem: ChatMessage[] = [
        { role: 'system', content: this.SYSTEM_PROMPT },
        ...messages.filter(msg => msg.role !== 'system')
      ];

      const completion = await openai.chat.completions.create({
        model: this.MODEL,
        messages: messagesWithSystem,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      });

      const responseMessage = completion.choices[0]?.message?.content;
      
      if (!responseMessage) {
        throw new Error('No response received from the model');
      }

      return {
        message: responseMessage.trim()
      };
    } catch (error: any) {
      console.error('OpenRouter API Error:', error);
      
      let errorMessage = 'Failed to get response from AI assistant.';
      
      if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please check your OpenRouter API key in Vercel environment variables.';
        console.error('🔑 API Key Issue: Make sure VITE_OPENROUTER_API_KEY is set correctly in Vercel');
      } else if (error?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error?.status === 402) {
        errorMessage = 'Insufficient credits. Please check your OpenRouter account balance.';
      } else if (error?.message?.includes('User not found')) {
        errorMessage = 'OpenRouter API key is invalid or expired. Please check your API key.';
        console.error('🔑 Invalid API Key: The provided OpenRouter API key is not valid');
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      return {
        message: '',
        error: errorMessage
      };
    }
  }

  static async streamMessage(
    messages: ChatMessage[], 
    onToken: (token: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const messagesWithSystem: ChatMessage[] = [
        { role: 'system', content: this.SYSTEM_PROMPT },
        ...messages.filter(msg => msg.role !== 'system')
      ];

      const stream = await openai.chat.completions.create({
        model: this.MODEL,
        messages: messagesWithSystem,
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onToken(content);
        }
      }
      
      onComplete();
    } catch (error: any) {
      console.error('OpenRouter Streaming Error:', error);
      
      let errorMessage = 'Failed to get response from AI assistant.';
      
      if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please check your OpenRouter API key in Vercel environment variables.';
        console.error('🔑 API Key Issue: Make sure VITE_OPENROUTER_API_KEY is set correctly in Vercel');
      } else if (error?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error?.status === 402) {
        errorMessage = 'Insufficient credits. Please check your OpenRouter account balance.';
      } else if (error?.message?.includes('User not found')) {
        errorMessage = 'OpenRouter API key is invalid or expired. Please check your API key.';
        console.error('🔑 Invalid API Key: The provided OpenRouter API key is not valid');
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      onError(errorMessage);
    }
  }
}