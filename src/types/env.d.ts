/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly OPENROUTER_API_KEY: string;
    readonly OPENROUTER_BASE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }