import { getInvoice } from '@/api/invoices'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from './NotFound'
import InvoiceView from '@/components/invoice-view'
import BreadcrumbContext, { BreadcrumbItem } from '@/contexts/BreadcrumbContext'

const Invoice = () => {
  const params = useParams()
  const invoiceId = params.invoiceId ?? ''
  const { setBreadcrumbItems } = useContext(BreadcrumbContext)

  const { data: invoice, isLoading } = useQuery({
    queryKey: [`invoice-${invoiceId}`],
    queryFn: () => getInvoice(invoiceId ?? ''),
  })
  useEffect(() => {
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', url: '/' },
      { label: 'Invoices', url: '/invoices' },
      {
        label: invoice?.invoice_number ?? '',
        url: `/invoices/${invoice?.documentId}`,
      },
    ]
    setBreadcrumbItems(breadcrumbItems)
  }, [invoice, setBreadcrumbItems])

  if (isLoading) {
    return (
      <div className="w-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }
  if (!invoice) {
    return <NotFound />
  }
  return <InvoiceView invoice={invoice} />
}

export default Invoice
