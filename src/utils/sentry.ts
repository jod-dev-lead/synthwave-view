// Error logging and monitoring utilities
export const errorLogger = {
  // Log errors to console and external service if configured
  logError: (error: Error, context?: Record<string, any>) => {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // In production, you would send this to a service like Sentry
    // Example:
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { extra: context });
    // }
  },

  // Log user actions for analytics
  logUserAction: (action: string, data?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log('User Action:', { action, data, timestamp: new Date().toISOString() });
    }

    // In production, send to analytics service
    // Example:
    // analytics.track(action, data);
  },

  // Log performance metrics
  logPerformance: (metric: string, duration: number, data?: Record<string, any>) => {
    console.log('Performance Metric:', {
      metric,
      duration: `${duration.toFixed(2)}ms`,
      data,
      timestamp: new Date().toISOString(),
    });

    // In production, send to performance monitoring service
  }
};

// Global error handler - only add if not already present
if (typeof window !== 'undefined') {
  const globalThis = window as any;
  
  if (!globalThis.hasGlobalErrorHandler) {
    globalThis.hasGlobalErrorHandler = true;
    
    window.addEventListener('error', (event) => {
      errorLogger.logError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      errorLogger.logError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        reason: event.reason,
      });
    });
  }
}