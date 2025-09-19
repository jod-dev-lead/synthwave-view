import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, MessageSquare, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-dashboard.jpg";
import chartsFeature from "@/assets/charts-feature.jpg";
import aiChatFeature from "@/assets/ai-chat-feature.jpg";

const features = [
  {
    name: "Interactive Data Visualization",
    description: "Create stunning charts and graphs with real-time data visualization capabilities.",
    icon: BarChart3,
    image: chartsFeature,
  },
  {
    name: "AI-Powered Chat Assistant",
    description: "Get insights and answers from your data using our advanced AI chat interface.",
    icon: MessageSquare,
    image: aiChatFeature,
  },
  {
    name: "Lightning Fast Performance",
    description: "Built for speed with optimized queries and real-time updates across all devices.",
    icon: Zap,
  },
  {
    name: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption and compliance standards.",
    icon: Shield,
  },
  {
    name: "Advanced Analytics",
    description: "Deep insights with predictive analytics and machine learning capabilities.",
    icon: TrendingUp,
  },
];

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground font-serif sm:text-6xl lg:text-7xl animate-fade-in">
              Transform Your Data Into{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Actionable Insights
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              Experience the next generation of data visualization and AI-powered analytics. 
              Make data-driven decisions with beautiful charts and intelligent conversations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6 animate-scale-in">
              <Button asChild variant="hero" size="xl">
                <Link to="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/chat">
                  Try AI Chat
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative mx-auto mt-16 max-w-5xl animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-chart-2/10 p-2 shadow-2xl">
              <img
                src={heroImage}
                alt="DataVision AI Dashboard"
                className="w-full rounded-xl shadow-custom-lg hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif sm:text-4xl">
              Everything you need to visualize your data
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you understand and act on your data faster than ever before.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.name} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    {feature.image && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <img
                          src={feature.image}
                          alt={feature.name}
                          className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/5 to-chart-2/5 py-24">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif sm:text-4xl">
            Ready to transform your data?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses making better decisions with DataVision AI.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/dashboard">
                View Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}