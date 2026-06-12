import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import checker from 'vite-plugin-checker';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), '');

  return {
    base: env.VITE_URL_BASENAME || '/',
    plugins: [
      react(),
      tailwindcss(),
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx}"',

          useFlatConfig: true,
        },
        enableBuild: false,
        terminal: false,
        overlay: {
          initialIsOpen: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
