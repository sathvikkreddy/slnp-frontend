import { Invoice } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import {
  ArrowUpDown,
  Copy,
  Eye,
  MoreHorizontal,
  Pen,
  Trash,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { AddInvoiceDialog } from '../modals/invoice/add-invoice'

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Date
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="cursor-pointer"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return format(row.original.date, 'dd-MM-yyyy')
    },
    filterFn: (row, columnId, filterValue: DateRange | undefined) => {
      console.log('hi')
      if (!filterValue) return true
      const invoiceDate = new Date(row.original.date)
      const { from, to } = filterValue
      if (from && to) {
        return invoiceDate >= from && invoiceDate <= to
      }
      if (from && !to) {
        return invoiceDate >= from
      }
      if (!from && to) {
        return invoiceDate <= to
      }
      return true
    },
  },
  {
    id: 'invoice_number',
    accessorKey: 'invoice_number',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Invoice No
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="cursor-pointer"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    id: 'bill_to_company',
    accessorKey: 'bill_to_company',
    header: 'Bill To',
    filterFn: (row, columnId, filterValue: string) => {
      filterValue = filterValue.trim()
      return (
        row.original.bill_to_company.name
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        row.original.invoice_number
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      )
    },
    cell: ({ row }) => {
      const companyName = row.original.bill_to_company.name
      return companyName
      //   const columnFilters = table.getState().columnFilters
      //   const matchingFilter = columnFilters.find(
      //     (fil) =>
      //       fil.id === 'bill_to_company' &&
      //       companyName.includes(fil.value as string)
      //   )
      //   if (!matchingFilter) {
      //     return companyName
      //   }

      //   const matchingIndex = companyName.indexOf(matchingFilter.value as string)
      //   return (
      //     <div>
      //       {`${companyName.substring(0, matchingIndex)}`}
      //       <span className="underline">
      //         {companyName.substring(
      //           matchingIndex,
      //           matchingIndex + (matchingFilter.value as string).length
      //         )}
      //       </span>
      //       {`${companyName.substring(
      //         matchingIndex + (matchingFilter.value as string).length
      //       )}`}
      //     </div>
      //   )
    },
  },
  {
    id: 'bill_to_company_gst_number',
    accessorKey: 'bill_to_company_gst_number',
    header: 'Bill To GST No',
    cell: ({ row }) => row.original.bill_to_company.gst_number,
  },
  {
    id: 'ship_to_company',
    accessorKey: 'ship_to_company',
    header: 'Ship To',
    filterFn: (row, columnId, filterValue: string) => {
      return row.original.ship_to_company.name
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    },
    cell: ({ row }) => {
      const companyName = row.original.ship_to_company.name
      return companyName
      //   const columnFilters = table.getState().columnFilters
      //   const matchingFilter = columnFilters.find(
      //     (fil) =>
      //       fil.id === 'bill_to_company' &&
      //       companyName.includes(fil.value as string)
      //   )
      //   if (!matchingFilter) {
      //     return companyName
      //   }

      //   const matchingIndex = companyName.indexOf(matchingFilter.value as string)
      //   return (
      //     <div>
      //       {`${companyName.substring(0, matchingIndex)}`}
      //       <span className="underline">
      //         {companyName.substring(
      //           matchingIndex,
      //           matchingIndex + (matchingFilter.value as string).length
      //         )}
      //       </span>
      //       {`${companyName.substring(
      //         matchingIndex + (matchingFilter.value as string).length
      //       )}`}
      //     </div>
      //   )
    },
  },
  {
    id: 'ship_to_company_gst_number',
    accessorKey: 'ship_to_company_gst_number',
    header: 'Ship To GST No',
    cell: ({ row }) => row.original.ship_to_company.gst_number,
  },
  {
    id: 'taxable_amount',
    accessorKey: 'taxable_amount',
    header: 'Taxable Amount',
    filterFn: (row, columnId, filterValue: string) => {
      return row.original.taxable_amount
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    },
    footer: ({ table }) => {
      return table
        .getRowModel()
        .rows.reduce((total, row) => total + row.original.taxable_amount, 0)
    },
  },
  {
    id: 'cgst_amount',
    accessorKey: 'cgst_amount',
    header: 'CGST (9%)',
    filterFn: (row, columnId, filterValue: string) => {
      return row.original.cgst_amount
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    },
    footer: ({ table }) => {
      return table
        .getRowModel()
        .rows.reduce((total, row) => total + row.original.cgst_amount, 0)
    },
  },
  {
    id: 'sgst_amount',
    accessorKey: 'sgst_amount',
    header: 'SGST (9%)',
    filterFn: (row, columnId, filterValue: string) => {
      return row.original.sgst_amount
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    },
    footer: ({ table }) => {
      return table
        .getRowModel()
        .rows.reduce((total, row) => total + row.original.sgst_amount, 0)
    },
  },
  {
    id: 'igst_amount',
    accessorKey: 'igst_amount',
    header: 'IGST (18%)',
    filterFn: (row, columnId, filterValue: string) => {
      return row.original.igst_amount
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    },
    footer: ({ table }) => {
      return table
        .getRowModel()
        .rows.reduce((total, row) => total + row.original.igst_amount, 0)
    },
  },
  {
    accessorKey: 'invoice_amount',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Total Amount
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="cursor-pointer"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    footer: ({ table }) => {
      return table
        .getRowModel()
        .rows.reduce((total, row) => total + row.original.invoice_amount, 0)
    },
  },
  {
    id: 'row_actions',
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="flex justify-end">
          <Tooltip>
            <TooltipTrigger>
              <Link to={`${invoice.documentId}`}>
                <Eye className="w-4 h-4" strokeWidth={1.5} />
                <TooltipContent>View</TooltipContent>
              </Link>
            </TooltipTrigger>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Pen className="w-4 h-4" /> Edit
              </DropdownMenuItem>
              <Button className="w-full" variant="ghost">
                <Copy className="w-4 h-4" />
                <AddInvoiceDialog
                  label="Duplicate"
                  buttonProps={{ variant: 'ghost', className: 'p-0' }}
                  existingInvoice={row.original}
                />
              </Button>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
