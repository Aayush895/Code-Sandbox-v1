function Navbar() {
  return (
    <div className="navbar bg-gray-800 shadow-sm">
      <div className="navbar-start">
        <div className="flex items-center gap-3">
          <div className="w-10.5 h-10.5 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-[10px] flex items-center justify-center shadow-[0_4px_15px_rgba(102,126,234,0.4)]">
            <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-white">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
            </svg>
          </div>

          <span className="text-lg font-semibold">CloudCode</span>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className="mx-3">
            <p className="hover:bg-linear-to-br from-[#667eea] to-[#764ba2]">
              Projects
            </p>
          </li>
          <li className="mx-3">
            <p className="hover:bg-linear-to-br from-[#667eea] to-[#764ba2]">
              Templates
            </p>
          </li>
          <li className="mx-3">
            <p className="hover:bg-linear-to-br from-[#667eea] to-[#764ba2]">
              Documentation
            </p>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <div className="avatar avatar-placeholder">
          <div className="bg-linear-to-br from-[#667eea] to-[#764ba2] shadow-[0_4px_15px_rgba(102,126,234,0.4)] text-neutral-content w-12 rounded-full">
            <span>SY</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Navbar
