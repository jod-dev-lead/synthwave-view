import { Header } from "@/components/header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10 animate-pulse-soft"></div>
        
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-full animate-float opacity-40 blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-chart-2/20 to-chart-3/20 rounded-full animate-bounce-gentle opacity-30 blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-chart-3/20 to-chart-4/20 rounded-full animate-pulse-soft opacity-35 blur-xl" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-gradient-to-br from-chart-4/20 to-chart-5/20 rounded-full animate-float opacity-25 blur-xl" style={{ animationDelay: '1s' }}></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/60 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-chart-2/80 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-chart-3/70 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 right-1/5 w-1 h-1 bg-chart-4/90 rounded-full animate-pulse-soft" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgb(30,157,241)_1px,transparent_0)] bg-[length:24px_24px] animate-rotate-gentle"></div>
        
        {/* Organic flowing shapes */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-full animate-float opacity-20 blur-3xl" style={{ animationDelay: '5s' }}></div>
        <div className="absolute bottom-1/2 right-0 w-80 h-80 bg-gradient-to-l from-transparent via-chart-2/5 to-transparent rounded-full animate-bounce-gentle opacity-15 blur-3xl" style={{ animationDelay: '3.5s' }}></div>
        
        {/* Additional dynamic elements */}
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-gradient-to-br from-chart-3/10 to-transparent rounded-full animate-drift opacity-25 blur-2xl" style={{ animationDelay: '6s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-56 h-56 bg-gradient-to-tl from-chart-4/10 to-transparent rounded-full animate-wave opacity-20 blur-2xl" style={{ animationDelay: '4.5s' }}></div>
        
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        
        {/* Flowing gradient lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse-soft"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-chart-2/20 to-transparent animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-chart-3/20 to-transparent animate-pulse-soft" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Header />
      <main className="flex-1 pt-header relative z-10">
        {children}
      </main>
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                DataVision AI
              </span>
              <span className="text-sm text-muted-foreground">
                © 2024 DataVision AI. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors hover-lift">
                About
              </a>
              <a href="#" className="hover:text-primary transition-colors hover-lift">
                Contact
              </a>
              <a href="#" className="hover:text-primary transition-colors hover-lift">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors hover-lift">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}