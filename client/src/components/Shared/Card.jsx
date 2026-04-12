function Card({
  cardTitle,
  cardDesc,
  cardBadges,
  cardIcon,
  setProject,
  type,
  project,
  isSelected,
}) {
  function handleProjectType() {
    setProject({ ...project, projectType: type })
  }

  return (
    <div
      className={`card bg-base-100
      shadow-md
      mb-4
      hover:shadow-2xl
      hover:ring-2 
      hover:ring-primary
      hover:translate-x-1 transition-transform duration-200
      cursor-pointer
      w-full
      ${isSelected ? 'ring-2 ring-primary border border-primary' : ''}`}
    >
      <div className="card-body" onClick={handleProjectType}>
        <div className="flex items-center">
          <div className="w-18 h-18 bg-linear-to-br from-[#27272a] to-[#3f3f46] rounded-[14px] flex items-center justify-center text-[36px] shrink-0">
            {cardIcon}
          </div>
          <div className="mx-10">
            <h2 className="card-title mb-3">{cardTitle}</h2>
            <p className="text-sm text-base-content/70">{cardDesc}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {cardBadges.length > 0 &&
            cardBadges.map((badge, idx) => {
              return (
                <div key={idx} className="badge badge-outline">
                  {badge}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
export default Card
