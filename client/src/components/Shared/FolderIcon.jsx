import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai"

export function FolderIcon({ isOpen }) {
  return isOpen ? (
    <AiFillFolderOpen color="#dcb67a" />
  ) : (
    <AiFillFolder color="#dcb67a" />
  )
}
