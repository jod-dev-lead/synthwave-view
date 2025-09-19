// src/services/openrouter.ts
import OpenAI from 'openai';

// Validate environment variables
const validateEnv = () => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
    throw new Error('VITE_OPENROUTER_API_KEY is not defined. Please set it in your environment variables.');
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
        errorMessage = 'Invalid API key. Please check your OpenRouter configuration.';
      } else if (error?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error?.status === 402) {
        errorMessage = 'Insufficient credits. Please check your OpenRouter account.';
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
        errorMessage = 'Invalid API key. Please check your OpenRouter configuration.';
      } else if (error?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      onError(errorMessage);
    }
  }
}