import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts'
import BreadcrumbContext, {
  BreadcrumbItem,
} from '../contexts/BreadcrumbContext'

const Home = () => {
  const { user } = useContext(UserContext)
  const { setBreadcrumbItems } = useContext(BreadcrumbContext)

  useEffect(() => {
    const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', url: '/' }]
    setBreadcrumbItems(breadcrumbItems)
  }, [setBreadcrumbItems])

  return <div>{user?.email}</div>
}

export default Home
