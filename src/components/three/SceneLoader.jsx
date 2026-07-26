import { useProgress } from '@react-three/drei'

function SceneLoader({ status }) {
  const { active, progress } = useProgress()

  if (import.meta.env.DEV && status === 'missing') {
    return (
      <p className="shoe-canvas__notice">
        sneaker.glb non trovato — placeholder 3D attivo
      </p>
    )
  }

  if (!active) {
    return null
  }

  return (
    <div className="shoe-canvas__loader">
      <span>Caricamento modello</span>
      <span>{Math.round(progress)}%</span>
      <span
        className="shoe-canvas__loader-progress"
        style={{ '--load-progress': `${progress}%` }}
      />
    </div>
  )
}

export default SceneLoader
