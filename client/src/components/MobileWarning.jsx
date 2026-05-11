function MobileWarning() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#1e1e1e] p-8 text-center gap-6">
      <div className="text-6xl">🖥️</div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-base-content font-mono m-0">
          Desktop only
        </h1>
        <p className="text-base-content/50 text-sm max-w-xs leading-relaxed font-mono m-0">
          This app is designed for laptops and desktops. Please open it on a
          larger screen for the best experience.
        </p>
      </div>

      <div className="flex gap-3 mt-2">
        {[
          { icon: '💻', label: 'Laptop' },
          { icon: '🖥️', label: 'Desktop' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-lg px-4 py-2 text-base-content/60 text-xs font-mono"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileWarning
