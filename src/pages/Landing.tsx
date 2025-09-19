import { Link } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    MessageSquare,
    Zap,
    Shield,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import heroImage from "@/assets/hero-dashboard.jpg";
import chartsFeature from "@/assets/charts-feature.jpg";
import aiChatFeature from "@/assets/ai-chat-feature.jpg";
import lightningFastPerformance from "@/assets/lightning_fast_performance.svg";
import enterpriseSecurity from "@/assets/security.svg";
import advancedAnalytics from "@/assets/analytics.svg";

const features = [
    {
        name: "Interactive Data Visualization",
        description:
            "Create stunning charts and graphs with real-time data visualization capabilities. Our tools make it easy to explore, filter, and present your data in a way that's both beautiful and insightful.",
        icon: BarChart3,
        image: chartsFeature,
    },
    {
        name: "AI-Powered Chat Assistant",
        description:
            "Our advanced AI assistant is more than a chatbot. It can analyze complex datasets, answer your questions in natural language, and generate custom reports, all without a single line of code.",
        icon: MessageSquare,
        image: aiChatFeature,
    },
    {
        name: "Lightning Fast Performance",
        description:
            "Don't wait for your data. Our platform is engineered for speed, with optimized queries and real-time updates that ensure a fluid and responsive experience across all your devices.",
        icon: Zap,
        image: lightningFastPerformance,
    },
    {
        name: "Enterprise Security",
        description:
            "Your data's security is our top priority. We use bank-level encryption, multi-factor authentication, and strict compliance standards to keep your information safe and secure at all times.",
        icon: Shield,
        image: enterpriseSecurity,
    },
    {
        name: "Advanced Analytics",
        description:
            "Go beyond the surface with advanced analytics. Our platform provides deep insights, predictive modeling, and machine learning capabilities to help you anticipate trends and make strategic decisions.",
        icon: TrendingUp,
        image: advancedAnalytics,
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
                            Go beyond simple charts. Our platform combines
                            stunning data visualization with a powerful AI
                            assistant, turning complex data into clear,
                            conversational insights so you can make smarter
                            decisions faster.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-6 animate-scale-in">
                            <Button asChild variant="hero" size="xl">
                                <Link to="/dashboard">
                                    Get Started{" "}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="xl">
                                <Link to="/chat">Meet Our AI Assistant</Link>
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
                            Features That Bring Your Data to Life
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Discover a suite of tools built to empower you, from
                            stunning visuals to predictive insights.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={feature.name}
                                    className="hover-lift animate-fade-in"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
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
                                            <CardTitle className="text-xl">
                                                {feature.name}
                                            </CardTitle>
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
                        Join thousands of businesses making better decisions
                        with DataVision AI.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button asChild variant="hero" size="xl">
                            <Link to="/auth">
                                Start Free Trial{" "}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="xl">
                            <Link to="/dashboard">View Demo</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
