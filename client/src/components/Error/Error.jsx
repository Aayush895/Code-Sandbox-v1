import { ErrorBoundary } from 'react-error-boundary'

function fallbackRenderer({ error }) {
  return (
    <div>
      <p>Something went wrong</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

function Error({ children }) {
  return <ErrorBoundary fallback={fallbackRenderer}>{children}</ErrorBoundary>
}
export default Error
