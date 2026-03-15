function ContextMenu({ xCoord, yCoord }) {
  return (
    <ul
      className="menu bg-base-100 rounded-box w-56 absolute shadow-lg z-50"
      style={{ top: `${yCoord}px`, left: `${xCoord}px` }}
    >
      <li>
        <p>Create Folder</p>
      </li>
      <li>
        <p>Create File</p>
      </li>
      <li>
        <p>Delete Folder</p>
      </li>
      <li>
        <p>Delete File</p>
      </li>
      <li>
        <p>Rename Folder</p>
      </li>
      <li>
        <p>Rename File</p>
      </li>
    </ul>
  )
}
export default ContextMenu
