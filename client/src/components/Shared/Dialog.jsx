function Dialog({ title, content }) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="card bg-error/10 border border-error/30 shadow-md w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title text-error">⚠️ {title}</h2>
          <p className="text-error/70">{content}</p>
        </div>
      </div>
    </div>
  )
}

export default Dialog
