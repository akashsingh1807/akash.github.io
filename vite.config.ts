import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log environment variables for debugging
  console.log('Loaded environment variables:', {
    OPENROUTER_API_KEY: env.OPENROUTER_API_KEY ? 'Present' : 'Missing',
    NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_TITLE: env.NEXT_PUBLIC_APP_TITLE
  });
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Make env variables available to the client
    define: {
      'import.meta.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
      'import.meta.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(env.NEXT_PUBLIC_SITE_URL),
      'import.meta.env.NEXT_PUBLIC_APP_TITLE': JSON.stringify(env.NEXT_PUBLIC_APP_TITLE),
    }
  };
});
