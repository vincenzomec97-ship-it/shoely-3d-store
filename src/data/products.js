const products = [
  {
    id: 'air-jordan-retro-high',
    name: 'Air Jordan 1 Retro High',
    subtitle: 'High top / Ice blue',
    price: 99,
    image: '/images/figma-air-jordan-retro.png',
    model: '/models/aero-one.glb',
    accentColor: '#ff6b25',
    description: 'Profilo alto, pannelli azzurri e una silhouette rétro.',
  },
  {
    id: 'air-force-mid-special',
    name: 'Air Force 1 Mid Special',
    subtitle: 'Custom edition / Multicolor',
    price: 259,
    image: '/images/figma-air-force-special.png',
    model: '/models/street-force.glb',
    accentColor: '#75d9e8',
    description: 'Edizione illustrata multicolore dal carattere grafico.',
  },
  {
    id: 'nike-tuned',
    name: 'Nike Tuned',
    subtitle: 'Performance / Red black',
    price: 199,
    image: '/images/figma-nike-tuned.png',
    model: '/models/pulse-runner.glb',
    accentColor: '#efc56d',
    description: 'Runner tecnica rossa e nera con volumi dinamici.',
  },
  {
    id: 'air-force-mid-white',
    name: 'Air Force 1 Mid',
    subtitle: 'Mid top / Drip white',
    price: 179,
    image: '/images/figma-air-force-white.png',
    model: '/models/cloud-motion.glb',
    accentColor: '#a8e8f0',
    description: 'Base bianca con dettaglio nero a effetto dripping.',
  },
]

const priceFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

export function formatPrice(price) {
  return priceFormatter.format(price)
}

export default products
