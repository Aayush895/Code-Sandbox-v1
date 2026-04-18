import Editor from '@monaco-editor/react'
import { useParams } from 'react-router'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import useEditorStore from '../../../store/useEditorStore'
import { EXTENSION_TO_LANGUAGE } from '../../../Utils/languageMappings'
import ShowActiveFile from './ShowActiveFile'

function BrowserEditor({
  activeFilesArr,
  setActiveFilesArr,
  fileExtension,
  setFileExtension,
}) {
  const { fileContents, activeFile } = useEditorStore()
  const { editorSocket } = useEditorSocketStore()
  const { projectId } = useParams()
  let timerId = null

  function handleWriteFile(value) {
    if (timerId != null) clearTimeout(timerId)

    if (editorSocket) {
      let fileArray = activeFile.split('/')

      timerId = setTimeout(() => {
        editorSocket.emit('write-file', {
          filePath: activeFile,
          roomId: `${projectId}/${fileArray[fileArray.length - 1]}`,
          fileData: value,
        })
      }, 2000)
    }
  }

  function getLanguage() {
    return EXTENSION_TO_LANGUAGE[fileExtension]
  }

  return (
    <div style={{ height: '100vh', width: '80%' }}>
      <div className="flex flex-row items-center overflow-x-auto overflow-y-hidden bg-[#252526] border-b border-b-[#1e1e1e] shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {activeFilesArr.length > 0 &&
          activeFilesArr.map((activeFile, idx) => (
            <ShowActiveFile
              activeFilePath={activeFile}
              activeFilesArr={activeFilesArr}
              setActiveFilesArr={setActiveFilesArr}
              setFileExtension={setFileExtension}
              key={`${activeFile}-${idx}`}
            />
          ))}
      </div>
      <Editor
        height="100vh"
        language={getLanguage()}
        defaultValue="// Welcome to the code playground"
        theme="vs-dark"
        value={
          fileContents ? fileContents : '// Welcome to the code playground'
        }
        onChange={handleWriteFile}
      />
    </div>
  )
}
export default BrowserEditor
