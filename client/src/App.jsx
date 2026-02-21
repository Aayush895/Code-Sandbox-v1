import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Error from './components/Error/Error'
import Routes from './Routes'

function App() {
  const queryClient = new QueryClient()
  return (
    <Error>
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </Error>
  )
}
export default App
