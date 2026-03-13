import Editor from '@monaco-editor/react'
import useEditorSocketStore from '../../../store/useEditorSocketStore'
import useEditorStore from '../../../store/useEditorStore'
import useProjectStore from '../../../store/useProjectStore'

function BrowserEditor() {
  const { fileContents, activeFile } = useEditorStore()
  const { editorSocket } = useEditorSocketStore()
  const { projectId } = useProjectStore()
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

  return (
    <div style={{ flex: 1, height: '100vh' }}>
      <Editor
        height="100vh"
        defaultLanguage="javascript"
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
