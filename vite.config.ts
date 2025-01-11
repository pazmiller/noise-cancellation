import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // 确保指向项目的根目录
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'react-build', // 打包输出目录
  },
});
