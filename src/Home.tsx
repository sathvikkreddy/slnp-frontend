import { useContext } from 'react'
import { UserContext } from './contexts'

const Home = () => {
  const { user, isLoading } = useContext(UserContext)
  if (isLoading) {
    return <div>Loading...</div>
  }
  return <div>{user?.email}</div>
}

export default Home
