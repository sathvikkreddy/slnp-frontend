import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContextProvider } from './contexts/UserContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AuthAppCheck from './components/auth/AuthAppCheck'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <AuthAppCheck />
      </UserContextProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}

export default App
