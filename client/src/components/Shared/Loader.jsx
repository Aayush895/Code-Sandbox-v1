function Loader({ fullScreen = false }) {
  return (
    <div
      className={`flex justify-center ${fullScreen ? 'h-screen items-center' : 'py-4'}`}
    >
      <span className="loading loading-spinner loading-xl"></span>
    </div>
  )
}

export default Loader
