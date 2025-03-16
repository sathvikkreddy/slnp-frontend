import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContextProvider } from './contexts/UserContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AuthAppCheck from './components/auth/AuthAppCheck'
import { BreadcrumbContextProvider } from './contexts/BreadcrumbContext'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/sonner'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <TooltipProvider>
          <BreadcrumbContextProvider>
            <AuthAppCheck />
          </BreadcrumbContextProvider>
        </TooltipProvider>
      </UserContextProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  )
}

export default App
