import api from '@/lib/axios'
import { Company } from '@/types'

export const getCompanies = async () => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) return null
  try {
    const response = await api.get('/api/companies?populate=*', {
      headers: { Authorization: `Bearer ${slnp_jwt}` },
    })
    return response.data.data as Company[]
  } catch (error) {
    console.error('Error fetching users:', error)
    return null
  }
}
