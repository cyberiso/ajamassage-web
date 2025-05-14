import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.')
  
  return {
  plugins: [react()],
  server: { // server yapılandırması eklendi
    proxy: {
      // '/api' ile başlayan istekleri backend sunucusuna yönlendir
      '/api': {
        target: env.VITE_API_BASE_URL || 'http://localhost:5000', // .env dosyasından veya varsayılan değer
        changeOrigin: true, // Origin header'ını değiştir
        secure: false, // HTTPS sertifikası doğrulaması (geliştirme için false)
        // İsteğe bağlı: Yolu yeniden yazmak isterseniz
        // rewrite: (path) => path.replace(/^\/api/, '') 
      },
    },
  },
  }
})
