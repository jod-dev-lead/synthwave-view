import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseOpenRouterReturn {
  sendMessage: (messages: Message[], conversationId?: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useOpenRouter(): UseOpenRouterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Message[], conversationId?: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending messages to AI chat function:', messages);

      const { data, error: functionError } = await supabase.functions.invoke('ai-chat', {
        body: { 
          messages: messages,
          conversationId: conversationId 
        },
      });

      if (functionError) {
        console.error('Edge function error:', functionError);
        throw new Error(functionError.message || 'Failed to get AI response');
      }

      if (!data || !data.message) {
        throw new Error('Invalid response from AI service');
      }

      console.log('Received AI response:', data.message);
      return data.message;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('OpenRouter hook error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
}

// For production use, uncomment and configure this:
/*
export function useOpenRouter(): UseOpenRouterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Message[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'DataVision AI Assistant',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
}
*/