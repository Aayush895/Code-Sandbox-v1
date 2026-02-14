function DescriptionCard({ cardName, cardDesc, cardIcon }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body items-center text-center">
        <div className="text-4xl">{cardIcon}</div>
        <h3 className="card-title">{cardName}</h3>
        <p>{cardDesc}</p>
      </div>
    </div>
  )
}
export default DescriptionCard
