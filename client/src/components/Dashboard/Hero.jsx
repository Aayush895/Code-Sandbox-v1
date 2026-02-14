import { useNavigate } from 'react-router'
import DescriptionCard from '../Shared/DescriptionCard'

function Hero() {
  const navigate = useNavigate()

  function handleBtnClick() {
    navigate('/template')
  }

  return (
    <div className="hero bg-base-200 min-h-[93.2vh]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <div className="mb-10 text-[#667eea] flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              <circle
                cx="70"
                cy="70"
                r="60"
                stroke="currentColor"
                stroke-width="3"
                stroke-dasharray="8 6"
                opacity="0.3"
              />
              <rect
                x="45"
                y="50"
                width="50"
                height="40"
                rx="4"
                stroke="currentColor"
                stroke-width="3"
                opacity="0.5"
              />
              <circle
                cx="70"
                cy="70"
                r="18"
                stroke="currentColor"
                stroke-width="3"
              />
              <path
                d="M70 60V80M60 70H80"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-bold">
            Let's build something amazing! 🚀
          </h1>

          <p className="py-6">
            You don't have any projects yet. Create your first project to get
            started with React or Express development.
          </p>

          <button className="btn btn-primary mb-10 hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(102,126,234,0.5)]" onClick={handleBtnClick}>
            + Create Your First Project
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <DescriptionCard
              cardIcon="⚛️"
              cardDesc="Build modern UIs with React 18 and Vite"
              cardName="React Apps"
            />

            <DescriptionCard
              cardIcon="🚀"
              cardDesc="Create RESTful backends with Node.js"
              cardName="Express APIs"
            />

            <DescriptionCard
              cardIcon="⚡"
              cardDesc="See your changes instantly in the browser"
              cardName="Live Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
