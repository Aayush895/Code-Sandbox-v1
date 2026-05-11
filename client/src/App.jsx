import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Error from './components/Error/Error'
import MobileWarning from './components/MobileWarning'
import Routes from './Routes'

function App() {
  const isMobile = window.innerWidth < 1024

  if (isMobile) {
    return <MobileWarning />
  }
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
