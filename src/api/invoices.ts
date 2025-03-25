import { AddInvoice } from '@/components/modals/invoice/add-invoice'
import api from '@/lib/axios'
import { Invoice } from '@/types'

export const getInvoices = async () => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) return null
  try {
    const response = await api.get('/api/invoices?populate=*', {
      headers: { Authorization: `Bearer ${slnp_jwt}` },
    })
    return response.data.data as Invoice[]
  } catch (error) {
    console.error('Error fetching users:', error)
    return null
  }
}

export const getInvoice = async (invoiceId: string) => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) return null

  try {
    const response = await api.get(
      `/api/invoices/${invoiceId}?populate[items]=*&populate[bill_to_company][populate]=address&populate[ship_to_company][populate]=address`,
      {
        headers: { Authorization: `Bearer ${slnp_jwt}` },
      }
    )

    return response.data.data as Invoice
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return null
  }
}

export const getInvoicesByCompany = async (companyId: number) => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) return null

  try {
    const response = await api.get(
      `/api/invoices?filters[bill_to_company][id][$eq]=${companyId}&populate[items]=*&populate[bill_to_company][populate]=address&populate[ship_to_company][populate]=address`,
      {
        headers: { Authorization: `Bearer ${slnp_jwt}` },
      }
    )

    return response.data.data as Invoice[]
  } catch (error) {
    console.error('Error fetching invoices by company:', error)
    return null
  }
}

export const createInvoice = async (invoiceData: AddInvoice) => {
  const slnp_jwt = localStorage.getItem('slnp_jwt')
  if (!slnp_jwt) return null

  try {
    console.log({ data: invoiceData })
    const response = await api.post(
      '/api/invoices',
      { data: invoiceData },
      {
        headers: { Authorization: `Bearer ${slnp_jwt}` },
      }
    )

    return response.data.data as Invoice
  } catch (error) {
    console.error('Error creating invoice:', error)
    return null
  }
}
