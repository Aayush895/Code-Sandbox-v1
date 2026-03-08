import Editor from '@monaco-editor/react'
import useEditorStore from '../../../store/useEditorStore'

function BrowserEditor() {
  const { fileContents } = useEditorStore()
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
      />
    </div>
  )
}
export default BrowserEditor
