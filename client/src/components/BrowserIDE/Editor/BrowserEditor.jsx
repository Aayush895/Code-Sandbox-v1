import Editor from '@monaco-editor/react'

function BrowserEditor() {
  return (
    <div style={{ flex: 1, height: '100vh' }}>
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme="vs-dark"
      />
    </div>
  )
}
export default BrowserEditor
