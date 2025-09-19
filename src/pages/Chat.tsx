import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Bot, User, Sparkles, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OpenRouterService, type ChatMessage as OpenRouterMessage } from "@/services/openrouter";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
  error?: string;
}

const examplePrompts = [
  "Analyze the latest sales data trends",
  "Create a revenue forecast for Q4", 
  "What insights can you provide from our user data?",
  "Help me understand our conversion metrics",
  "How can I improve my dashboard design?",
  "What are the best practices for data visualization?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI data assistant powered by Mistral 7B. I can help you analyze data, create insights, understand analytics, and answer questions about data visualization. What would you like to explore today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Create assistant message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Prepare conversation history for API
    const conversationHistory: OpenRouterMessage[] = messages
      .filter(msg => !msg.error) // Exclude error messages
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    
    // Add the new user message
    conversationHistory.push({
      role: "user",
      content: userMessage.content
    });

    try {
      // Use streaming for better UX
      await OpenRouterService.streamMessage(
        conversationHistory,
        // onToken
        (token: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: msg.content + token }
              : msg
          ));
        },
        // onComplete
        () => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          ));
          setIsLoading(false);
        },
        // onError
        (errorMessage: string) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { 
                  ...msg, 
                  content: "I apologize, but I encountered an error while processing your request.", 
                  error: errorMessage,
                  isStreaming: false 
                }
              : msg
          ));
          setError(errorMessage);
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: "I apologize, but I encountered an unexpected error.",
              error: "Unexpected error occurred",
              isStreaming: false 
            }
          : msg
      ));
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleExamplePrompt = (prompt: string) => {
    setInput(prompt);
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === "user");
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      // Remove the last assistant message with error
      setMessages(prev => prev.filter(msg => !msg.error));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-6 max-w-4xl flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="rounded-full bg-gradient-to-r from-primary to-primary-glow p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">
              AI Data Assistant
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powered by OpenRouter's Mistral 7B model. Get intelligent insights from your data through natural conversation.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={retryLastMessage}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Example Prompts */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Try asking about:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {examplePrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto p-3 hover-lift"
                  onClick={() => handleExamplePrompt(prompt)}
                  disabled={isLoading}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Conversation
              <Badge variant="secondary" className="ml-auto">
                Mistral 7B
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[500px] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 animate-fade-in",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "rounded-full p-2 flex-shrink-0",
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : message.error
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : message.error ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%] shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : message.error
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                        )}
                      </p>
                      {message.error && (
                        <p className="text-xs mt-2 opacity-70">
                          Error: {message.error}
                        </p>
                      )}
                      <p className={cn(
                        "text-xs mt-2 opacity-70",
                        message.role === "user" 
                          ? "text-primary-foreground/70" 
                          : message.error
                          ? "text-destructive/70"
                          : "text-muted-foreground/70"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="rounded-full p-2 bg-muted text-muted-foreground flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data, request analysis, or explore insights..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="hover-lift"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Powered by OpenRouter's Mistral 7B model. Responses are generated by AI and may not always be accurate.
        </p>
      </div>
    </div>
  );
}