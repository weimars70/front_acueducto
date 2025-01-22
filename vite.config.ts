import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: path.resolve(__dirname, './src/styles/quasar-variables.sass')
    })
  ],
  base: './', // Add this line
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['@capacitor/network'],
      output: {
        globals: {
          '@capacitor/network': 'capacitorNetwork'
        }
      }
    },
    commonjsOptions: {
      esmExternals: true 
    }
  }
});