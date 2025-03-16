import { getInvoice } from '@/api/invoices'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NotFound from './NotFound'
import InvoiceView from '@/components/invoice-view'

const Invoice = () => {
  const params = useParams()
  const invoiceId = params.invoiceId
  const navigate = useNavigate()
  useEffect(() => {
    if (!invoiceId) {
      navigate('/invoices')
    }
  }, [invoiceId, navigate])
  const { data: invoice, isLoading } = useQuery({
    queryKey: [`invoice-${invoiceId}`],
    queryFn: () => getInvoice(invoiceId ?? ''),
  })
  if (isLoading) {
    return (
      <div className="w-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }
  console.log(invoice)
  if (!invoice) {
    return <NotFound />
  }
  return <InvoiceView invoice={invoice} />
}

export default Invoice
