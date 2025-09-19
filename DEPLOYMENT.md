# Vercel Deployment Guide

## Issues Fixed

### 1. 404 Error on Chat Route ✅
The chatbot was returning a 404 error because Vercel didn't know how to handle client-side routing for the React SPA.

### 2. 401 "User not found" Error ✅
The OpenRouter API was returning 401 errors due to missing or invalid API key configuration.

## Solutions Applied

1. **Created `vercel.json`** - This file tells Vercel to serve the `index.html` file for all routes, enabling client-side routing.

2. **Updated `vite.config.ts`** - Added proper build configuration for Vercel deployment.

3. **Enhanced error handling** - Added comprehensive environment variable validation and better error messages.

## Environment Variables Required

Set these in your Vercel dashboard (Project Settings > Environment Variables):

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## How to Get Your OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in to your account
3. Go to your dashboard
4. Navigate to "Keys" section
5. Create a new API key
6. Copy the key (starts with `sk-or-v1-`)

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Your actual OpenRouter API key (starts with `sk-or-v1-`)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. **Redeploy** your project

## Troubleshooting

### If you still get 401 errors:

1. **Check the API key format**: Should start with `sk-or-v1-`
2. **Verify in Vercel**: Make sure the environment variable is set correctly
3. **Check OpenRouter account**: Ensure you have credits and the key is active
4. **Redeploy**: After setting environment variables, you must redeploy

### If you get 404 errors:

1. **Check `vercel.json`**: Make sure it exists in your project root
2. **Verify build**: Ensure the build process completes successfully
3. **Check routes**: Make sure all routes are defined in your React Router

## Files Modified

- `vercel.json` - SPA routing configuration
- `vite.config.ts` - Build optimization for Vercel
- `src/services/openrouter.ts` - Enhanced error handling and validation

## Testing

After deployment, test these URLs:
- `/` - Should show the landing page
- `/chat` - Should show the chatbot interface
- `/dashboard` - Should show the dashboard
- Any other route - Should redirect to the React app

The chatbot should now work correctly on Vercel! 🎉
