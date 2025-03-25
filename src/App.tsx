import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  UserContextProvider,
  ThemeContextProvider,
  BreadcrumbContextProvider,
} from './contexts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AuthAppCheck from './components/auth/AuthAppCheck'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/sonner'
function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <UserContextProvider>
          <TooltipProvider>
            <BreadcrumbContextProvider>
              <AuthAppCheck />
            </BreadcrumbContextProvider>
          </TooltipProvider>
        </UserContextProvider>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={true} />
      </ThemeContextProvider>
    </QueryClientProvider>
  )
}

export default App
