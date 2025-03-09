import { createContext } from 'react'
import { fetchMe } from '../api/auth'
import { useQuery } from '@tanstack/react-query'

export type User = {
  username: string
  email: string
}

const UserContext = createContext<IUserContext>({
  user: null,
  authenticated: false,
  isLoading: true,
})

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    refetchOnWindowFocus: false,
  })
  let userContextValue: IUserContext = {
    authenticated: false,
    user: null,
    isLoading,
  }

  if (userData && userData.authenticated) {
    userContextValue = {
      ...userData,
      isLoading,
    }
  } else {
    userContextValue = {
      authenticated: false,
      user: null,
      isLoading,
    }
  }
  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  )
}

export type IUserContext = {
  user: User | null
  authenticated: boolean
  isLoading: boolean
}

export default UserContext
