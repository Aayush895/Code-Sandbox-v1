import { RxCross2 } from 'react-icons/rx'
import { useParams } from 'react-router'
import useEditorSocketStore from '../../../store/useEditorSocketStore'

// TODO: Fix the bug where when we close the active file it's content should shift to the next recent file and it should automatically show that files content
function ShowActiveFile({ activeFilePath, activeFilesArr, setActiveFilesArr }) {
  const { projectId } = useParams()
  const { editorSocket } = useEditorSocketStore()

  const fileName =
    activeFilePath.split('/')[activeFilePath.split('/').length - 1]

  function handleActiveFileRemoval() {
    const newActiveFilesArrAfterRemoval = activeFilesArr.filter(
      (activeFile) => {
        return activeFilePath != activeFile
      },
    )

    setActiveFilesArr(newActiveFilesArrAfterRemoval)
  }

  function handleFetchFileContents() {
    if (editorSocket) {
      const roomId = `${projectId}/${fileName}`
      editorSocket.emit('read-file', { filePath: activeFilePath })
      editorSocket.emit('join-room', { roomId })
    }
  }

  return (
    <div
      role="tab"
      className="inline-flex items-center gap-1.5 px-3 h-8.75 bg-[#1e1e1e] text-[#cccccc] text-[13px] font-mono border-r border-r-[#252526] border-t border-t-[#007acc] cursor-pointer whitespace-nowrap shrink-0 select-none"
      onClick={handleFetchFileContents}
    >
      <span className="text-[#cccccc]">{fileName}</span>
      <span
        className="inline-flex items-center justify-center w-4.5 h-4.5 rounded text-[#858585] cursor-pointer transition-all duration-150 hover:bg-[#3a3a3a] hover:text-[#cccccc]"
        onClick={handleActiveFileRemoval}
      >
        <RxCross2 size={12} />
      </span>
    </div>
  )
}
export default ShowActiveFile
