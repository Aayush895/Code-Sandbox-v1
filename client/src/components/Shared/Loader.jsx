function Loader({ fullScreen = false, message = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${fullScreen ? 'h-screen' : 'py-4'}`}
    >
      <span className="loading loading-spinner loading-xl"></span>
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  )
}

export default Loader
