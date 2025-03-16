import { useContext, useEffect } from 'react'
// import { UserContext } from '../contexts'
import BreadcrumbContext, {
  BreadcrumbItem,
} from '../contexts/BreadcrumbContext'
import { useQuery } from '@tanstack/react-query'
// import { getUsers } from '@/api/users'
import { Loader2 } from 'lucide-react'
import { getInvoices } from '@/api/invoices'
import { DataTable } from '@/components/invoices-table/data-table'
import { columns } from '@/components/invoices-table/columns'
import { AddInvoiceDialog } from '@/components/modals/invoice/add-invoice'

const Home = () => {
  // const { user } = useContext(UserContext)
  const { setBreadcrumbItems } = useContext(BreadcrumbContext)

  // const { data: users, isLoading: isUsersLoading } = useQuery({
  //   queryKey: ['users'],
  //   queryFn: getUsers,
  // })

  const { data: invoices, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  })

  useEffect(() => {
    const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', url: '/' }]
    setBreadcrumbItems(breadcrumbItems)
  }, [setBreadcrumbItems])

  if (isInvoicesLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!invoices) {
    return <div>Error Ocuured</div>
  }

  return (
    <div>
      <AddInvoiceDialog />
      <DataTable data={invoices} columns={columns} />
    </div>
  )
}

export default Home
