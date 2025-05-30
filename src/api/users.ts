import api from '@/lib/axios'

export const getUsers = async () => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) return null
  try {
    const response = await api.get('/api/users', {
      headers: { Authorization: `Bearer ${slnp_jwt}` },
    })
    console.log('users: ', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    return null
  }
}
