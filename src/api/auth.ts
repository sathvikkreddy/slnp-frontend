import { User } from '../contexts/UserContext'
import api from '../lib/axios'

export const login = async () => {
  await api.post('api/connect/google')
}

export const fetchMe = async () => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) {
    return { authenticated: false, user: null }
  }
  try {
    const res = await api.get('/api/users/me', {
      headers: { Authorization: `Bearer ${slnp_jwt}` },
    })
    if (res.status !== 200) {
      return { authenticated: false, user: null }
    }
    console.log(res.data)
    return {
      authenticated: true,
      user: { username: res.data.username, email: res.data.email },
    } as { authenticated: boolean; user: User }
  } catch (err: any) {
    if (err.response.status === 401) {
      localStorage.removeItem('slnp_jwt')
      window.location.reload()
    }
    return { authenticated: false, user: null }
  }
}
