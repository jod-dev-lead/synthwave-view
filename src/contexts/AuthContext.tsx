// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, redirectUrl?: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, redirectUrl?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to restore your session. Please sign in again.",
        });
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
          break;
        case 'SIGNED_OUT':
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed successfully');
          break;
        case 'PASSWORD_RECOVERY':
          toast({
            title: "Password Reset",
            description: "Check your email for password reset instructions.",
          });
          break;
        case 'USER_UPDATED':
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          });
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signInWithEmail = async (email: string, redirectUrl?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl || `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message,
        });
        return { error };
      }

      toast({
        title: "Check Your Email",
        description: "We've sent you a magic link to sign in.",
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign in error:', authError);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, redirectUrl?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl || `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
        return { error };
      }

      toast({
        title: "Check Your Email",
        description: "We've sent you a magic link to complete your registration.",
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign up error:', authError);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Out Failed",
          description: error.message,
        });
        return { error };
      }

      // Clear any local storage or other cleanup
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign out error:', authError);
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Password Reset Failed",
          description: error.message,
        });
        return { error };
      }

      toast({
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Password reset error:', authError);
      return { error: authError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}