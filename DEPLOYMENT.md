# Vercel Deployment Guide

## Issue Fixed: 404 Error on Chat Route

The chatbot was returning a 404 error because Vercel didn't know how to handle client-side routing for the React SPA.

## Solution Applied

1. **Created `vercel.json`** - This file tells Vercel to serve the `index.html` file for all routes, enabling client-side routing.

2. **Updated `vite.config.ts`** - Added proper build configuration for Vercel deployment.

3. **Enhanced error handling** - Added environment variable validation in the OpenRouter service.

## Environment Variables Required

Set these in your Vercel dashboard (Project Settings > Environment Variables):

```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Deployment Steps

1. Push your changes to your Git repository
2. In Vercel dashboard, go to your project
3. Go to Settings > Environment Variables
4. Add the required environment variables
5. Redeploy your project

## Files Modified

- `vercel.json` - SPA routing configuration
- `vite.config.ts` - Build optimization for Vercel
- `src/services/openrouter.ts` - Enhanced error handling

The chatbot should now work correctly on Vercel!
