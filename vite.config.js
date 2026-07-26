import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const productModelPaths = [
  '/models/aero-one.glb',
  '/models/street-force.glb',
  '/models/pulse-runner.glb',
  '/models/cloud-motion.glb',
  '/models/sneaker.glb',
]
const modelAvailability = Object.fromEntries(
  productModelPaths.map((modelPath) => [
    modelPath,
    existsSync(new URL(`./public${modelPath}`, import.meta.url)),
  ]),
)

export default defineConfig({
  base: '/shoely-3d-store/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['@gsap/react'],
  },
  define: {
    __SHOE_MODEL_AVAILABILITY__: JSON.stringify(modelAvailability),
  },
})
