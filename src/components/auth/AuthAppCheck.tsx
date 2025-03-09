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

const AuthAppCheck = () => {
  const { isLoading, authenticated } = useContext(UserContext)
  if (isLoading) {
    return <div>Loading auth check...</div>
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
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" element={<Navigate to={'/'} />} />
      </Routes>
    </Router>
  )
}

export default AuthAppCheck
