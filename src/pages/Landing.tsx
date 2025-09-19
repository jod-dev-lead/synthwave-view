import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
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
import { Link } from "react-router-dom";
import imagea from "@/assets/imagea.jpg";
import imageb from "@/assets/imageb.jpg";
import imagec from "@/assets/imagec.jpg"; 

const FiArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
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
        image: imagea,
    },
    {
        name: "Enterprise Security",
        description:
            "Your data's security is our top priority. We use bank-level encryption, multi-factor authentication, and strict compliance standards to keep your information safe and secure at all times.",
        icon: Shield,
        image: imageb,
    },
    {
        name: "Advanced Analytics",
        description:
            "Go beyond the surface with advanced analytics. Our platform provides deep insights, predictive modeling, and machine learning capabilities to help you anticipate trends and make strategic decisions.",
        icon: TrendingUp,
        image: imagec,
    },
];

const FiMapPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const FaGithub = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.809 1.306 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.465-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.004-.404 1.021.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.772.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.197-6.091 8.197-11.387 0-6.627-5.373-12-12-12z" />
  </svg>
);
const FaXTwitter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.901 1.848h3.313l-8.623 9.947 10.375 12.05h-8.086l-6.845-7.922-8.549 7.922h-3.313l9.261-10.686-9.526-10.975h8.214l5.885 6.784 7.42-6.784zm-2.031 16.275l-7.794-8.995-1.841-2.126-7.734 8.959h-2.091l10.325-11.895h2.164l7.734 8.958 1.841 2.126 7.734-8.959h2.091l-10.325 11.895z" />
  </svg>
);
const FaLinkedin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46c0 .98.79 1.77 1.77 1.77h20.46c.98 0 1.77-.79 1.77-1.77V1.77C24 .79 23.21 0 22.23 0zM7.35 20.32H3.61V8.65h3.74v11.67zM5.48 7.02c-1.2 0-2.17-.97-2.17-2.17s.97-2.17 2.17-2.17 2.17.97 2.17 2.17-.97 2.17-2.17 2.17zm15.11 13.3H16.85V14c0-1.52-1.14-2.73-2.78-2.73-1.63 0-2.95 1.21-2.95 2.73v6.32h-3.74s.05-10.63 0-11.67h3.74v1.65c.6-.9 1.63-1.78 3.5-1.78 2.4 0 4.29 1.54 4.29 4.87v6.93z" />
  </svg>
);

interface ParallaxImgProps {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}

const ParallaxImg: React.FC<ParallaxImgProps> = ({ className, alt, src, start, end }) => {
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${-end}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

interface ScheduleItemProps {
  title: string;
  date: string;
  location: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ title, date, location }) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500 mt-2 sm:mt-0">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};



const CenterImage: React.FC = () => {
  const { scrollY } = useScroll();

  const SECTION_HEIGHT = 1500;
  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        // Using a placehold.co image URL to ensure the image displays correctly.
        backgroundImage: "url('/main.png')",
        backgroundPosition: "center ",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    />
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="mx-auto max-w-5xl px-4 py-20 pb-30 text-white">
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="text-1xl font-black uppercase text-zinc-50"
      >
        <span className="text-6xl">Features</span>
      </motion.h1>

      <div className="mt-16 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <img
            // Corrected the image source to a placeholder URL
            src="https://placehold.co/120x120/4b5563/ffffff?text=Feature+1"
            alt="Fans"
            className="h-32 w-32 bg-gray-800 p-2 rounded-full"
          />
          <div className="grid mt-8">
            <span className="text-2xl mb-3">Fans want to help</span>
            <span className="font-bold text-zinc-400 max-w-xs">
              Your fans are there to support you every time.
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src="https://placehold.co/120x120/4b5563/ffffff?text=Coin+GIF"
            alt="Coins"
            className="h-32 w-32 bg-gray-800 p-2 rounded-full"
          />
          <div className="grid mt-8">
            <span className="text-2xl mb-3">Fans want to help</span>
            <span className="font-bold text-zinc-400 max-w-xs">
              Your fans are there to support you every time.
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <img
            src="https://placehold.co/120x120/4b5563/ffffff?text=Group+GIF"
            alt="Group"
            className="h-32 w-32 bg-gray-800 p-2 rounded-full"
          />
          <div className="grid mt-8">
            <span className="text-2xl mb-3">Fans want to help</span>
            <span className="font-bold text-zinc-400 max-w-xs">
              Your fans are there to support you every time.
            </span>
          </div>
        </div>
      </div>
      
      <div id="cta" className="mt-20 mx-auto grid justify-center items-center bg-gray-900 p-12 rounded-lg text-center">
        <span className="mx-auto text-5xl mb-6 font-bold">
          Ready to be a part of the community?
        </span>
        <span className="m-auto font-bold text-zinc-400 max-w-xl">
          Join our cutting-edge community and be a part of our contributors forever.
        </span>
        <div className="flex justify-center items-center mt-12 gap-10">
          <a href="/Dashboard" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative px-7 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Get Started
            </span>
          </a>
          <a href="/Chat" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
            <span className="relative px-7 py-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Ai Chat
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

const ParallaxImages: React.FC = () => {
  const commonImgStyles = "rounded-lg object-cover shadow-2xl";
  const placeHolderSrc = "https://placehold.co/600x400/374151/ffffff?text=Image+Placeholder"

  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="/image1.webp"
        alt="Example of a space launch"
        start={500}
        end={-100}
        className={`w-1/3 ${commonImgStyles}`}
      />
      <ParallaxImg
        src="/image2.jpg"
        alt="Another space launch"
        start={450}
        end={-250}
        className={`mx-auto w-2/3 h-96 mb-24 ${commonImgStyles}`}
      />
      <ParallaxImg
        src="/image3.jpeg"
        alt="Orbiting satellite"
        start={0}
        end={-200}
        className={`ml-auto w-1/3 ${commonImgStyles}`}
      />
      <ParallaxImg
        src="/image4.png"
        alt="Another satellite"
        start={0}
        end={-500}
        className={`ml-24 w-100 h-60 ${commonImgStyles}`}
      />
    </div>
  );
};


export default function App() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          html { scroll-behavior: smooth; }
        `}
      </style>
      <script src="https://cdn.tailwindcss.com"></script>
      
      <div
        style={{ height: '200vh' }}
        className="relative w-full"
      >
        <CenterImage />
        <div className="absolute top-0 w-full h-full">
            <ParallaxImages />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
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
              Experience the next generation of data visualization and
              AI-powered analytics. Make data-driven decisions with beautiful
              charts and intelligent conversations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6 animate-scale-in">
              <Button asChild variant="hero" size="xl">
                <Link to="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/chat">Try AI Chat</Link>
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
              Powerful features designed to help you understand and act on your
              data faster than ever before.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.name}
                  className="hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
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
            Join thousands of businesses making better decisions with DataVision
            AI.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/dashboard">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
      
     
    </div>
  );
}
