import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseOpenRouterReturn {
  sendMessage: (messages: Message[]) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useOpenRouter(): UseOpenRouterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: Message[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll simulate an AI response
      // In production, replace this with actual OpenRouter API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const responses = [
        "Based on your data analysis request, I can see several interesting trends. Your monthly revenue shows strong growth with some seasonal variations. The key metrics indicate a positive trajectory, particularly in user acquisition and retention rates.",
        "I've analyzed the patterns in your dataset. The conversion metrics suggest opportunities for optimization in your funnel. Consider focusing on the mid-funnel stages where we see the highest drop-off rates.",
        "Looking at your analytics data, there are clear correlations between user engagement and revenue performance. I recommend implementing A/B tests on your high-traffic pages to maximize conversion potential.",
        "The data visualization reveals some compelling insights about user behavior. Peak usage occurs during specific hours, which could inform your content scheduling and resource allocation strategies.",
        "Your revenue forecast looks promising based on historical trends. The growth patterns suggest continued expansion, though I'd recommend monitoring the leading indicators we discussed for early trend detection."
      ];

      return responses[Math.floor(Math.random() * responses.length)];
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