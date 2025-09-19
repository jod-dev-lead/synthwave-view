import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Loader2, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { user, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    try {
      const { error } = activeTab === "signin" 
        ? await signInWithEmail(email)
        : await signUpWithEmail(email);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Check your email",
        description: `We've sent a magic link to ${email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 rounded-full bg-success/10 p-3 w-fit">
              <Mail className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in your email to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
            >
              Try Different Email
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow p-3 w-fit">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            DataVision AI
          </h1>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your analytics dashboard and AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full hover-lift" 
                    disabled={!email.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Magic Link...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Magic Link
                      </>
                    )}
                  </Button>
                </form>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    We'll email you a secure link to sign in
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full hover-lift" 
                    disabled={!email.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
                <div className="rounded-lg bg-accent/50 p-4">
                  <p className="text-sm text-accent-foreground">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}