import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import Login from '../../pages/auth/Login'
import Home from '../../Home'
import { useContext } from 'react'
import { UserContext } from '../../contexts'
import MainLayout from '../../MainLayout'
import { Loader2 } from 'lucide-react'

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
    return <PublicAppRouter />
  }
  return (
    <MainLayout>
      <AuthAppRouter />
    </MainLayout>
  )
}

const AuthAppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" element={<Navigate to={'/'} />} />
      </Routes>
    </Router>
  )
}
const PublicAppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="*" element={<Navigate to={'/login'} />} />
      </Routes>
    </Router>
  )
}

export default AuthAppCheck
