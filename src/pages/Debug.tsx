import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, Copy } from "lucide-react";

export default function Debug() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Immediate console log on page load
  console.log('🚨 DEBUG PAGE LOADED - Environment Variables:');
  console.log('OPENROUTER_API_KEY exists:', !!import.meta.env.OPENROUTER_API_KEY);
  console.log('OPENROUTER_API_KEY value:', import.meta.env.OPENROUTER_API_KEY);
  console.log('OPENROUTER_BASE_URL:', import.meta.env.OPENROUTER_BASE_URL);

  const checkEnvironmentVariables = () => {
    console.log('🔍 Environment Variables Debug:');
    console.log('OPENROUTER_API_KEY exists:', !!import.meta.env.OPENROUTER_API_KEY);
    console.log('OPENROUTER_API_KEY length:', import.meta.env.OPENROUTER_API_KEY?.length || 0);
    console.log('OPENROUTER_API_KEY starts with sk-or-v1:', import.meta.env.OPENROUTER_API_KEY?.startsWith('sk-or-v1-') || false);
    console.log('OPENROUTER_BASE_URL:', import.meta.env.OPENROUTER_BASE_URL);
    console.log('All env vars:', import.meta.env);
  };

  const testOpenRouterAPI = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test the API directly
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DataVision AI Chat Debug',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            { role: 'user', content: 'Hello, this is a test message.' }
          ],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        setTestResult('✅ API test successful! Your OpenRouter API key is working correctly.');
      } else {
        const errorText = await response.text();
        setTestResult(`❌ API test failed with status ${response.status}: ${errorText}`);
      }
    } catch (error: any) {
      setTestResult(`❌ API test failed with error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const apiKeyExists = !!import.meta.env.OPENROUTER_API_KEY;
  const apiKeyLength = import.meta.env.OPENROUTER_API_KEY?.length || 0;
  const apiKeyFormat = import.meta.env.OPENROUTER_API_KEY?.startsWith('sk-or-v1-') || false;
  const baseUrl = import.meta.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif mb-4">
          🔍 Environment Variables Debug
        </h1>
        <p className="text-muted-foreground">
          This page helps debug OpenRouter API configuration issues.
        </p>
      </div>

      <div className="space-y-6">
        {/* Environment Variables Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Environment Variables Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>OPENROUTER_API_KEY exists:</span>
              <Badge variant={apiKeyExists ? "default" : "destructive"}>
                {apiKeyExists ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Yes
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    No
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>API Key Length:</span>
              <Badge variant={apiKeyLength > 50 ? "default" : "destructive"}>
                {apiKeyLength} characters
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>Correct Format (sk-or-v1-):</span>
              <Badge variant={apiKeyFormat ? "default" : "destructive"}>
                {apiKeyFormat ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Yes
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    No
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span>Base URL:</span>
              <Badge variant="secondary">
                {baseUrl}
              </Badge>
            </div>

            {apiKeyExists && (
              <div className="flex items-center justify-between">
                <span>API Key Preview:</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {import.meta.env.OPENROUTER_API_KEY.substring(0, 20)}...
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(import.meta.env.OPENROUTER_API_KEY)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkEnvironmentVariables} variant="outline" className="w-full">
              Log Environment Variables to Console
            </Button>
            
            <Button 
              onClick={testOpenRouterAPI} 
              disabled={!apiKeyExists || isLoading}
              className="w-full"
            >
              {isLoading ? "Testing..." : "Test OpenRouter API"}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResult && (
          <Alert variant={testResult.includes('✅') ? "default" : "destructive"}>
            <AlertDescription>
              {testResult}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">If API Key is missing or incorrect:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Go to <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenRouter.ai</a></li>
                <li>Sign up or log in to your account</li>
                <li>Go to Dashboard → Keys</li>
                <li>Create a new API key</li>
                <li>Copy the key (starts with sk-or-v1-)</li>
                <li>Go to your Vercel dashboard</li>
                <li>Select your project → Settings → Environment Variables</li>
                <li>Add OPENROUTER_API_KEY with your actual key</li>
                <li>Select all environments (Production, Preview, Development)</li>
                <li>Save and redeploy your project</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
