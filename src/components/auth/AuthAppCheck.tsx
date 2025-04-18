import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import Login from '../../pages/auth/Login'
import Home from '../../pages/Home'
import { useContext } from 'react'
import { UserContext } from '../../contexts'
import MainLayout from '../../MainLayout'
import { Loader2 } from 'lucide-react'
import NotFound from '@/pages/NotFound'
import Invoice from '@/pages/Invoice'
import Invoices from '@/pages/Invoices'
import Payments from '@/pages/Payments'
import Purchases from '@/pages/Purchases'

const AuthAppCheck = () => {
  const { authenticated, isLoading } = useContext(UserContext)
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }
  if (!authenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="*" element={<Navigate to={'/login'} />} />
        </Routes>
      </Router>
    )
  }
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" element={<Navigate to={'/'} />} />
          <Route path="/invoices" Component={Invoices} />
          <Route path="/invoices/:invoiceId" Component={Invoice} />
          <Route path="/payments" Component={Payments} />
          <Route path="/purchases" Component={Purchases} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default AuthAppCheck
