import { Invoice } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { ArrowUpDown, Copy, Pen, Trash } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { redirect } from 'react-router-dom'

export const columns: ColumnDef<Invoice>[] = [
  {
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
    cell: ({ row }) => {
      return (
        <div
          className="cursor-pointer"
          onClick={() => redirect(`/invoices/${row.original.id}`)}
        >
          {row.original.invoice_number}
        </div>
      )
    },
  },
  {
    id: 'bill_to_company',
    accessorKey: 'bill_to_company',
    header: 'Bill To',
    filterFn: (row, columnId, filterValue: string) => {
      return row.original.bill_to_company.name
        .toLowerCase()
        .includes(filterValue.toLowerCase())
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
    accessorKey: 'invoice_amount',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Invoice Amount
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
    id: 'row_actions',
    cell: ({ row }) => {
      return (
        <div className="flex px-2 items-center justify-end">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() => alert(row.original.invoice_number)}
              >
                <Pen className="w-4 h-4" strokeWidth={1.5} />
                <TooltipContent>Edit</TooltipContent>
              </Button>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" className="cursor-pointer">
                <Copy className="w-4 h-4" strokeWidth={1.5} />
                <TooltipContent>Duplicate</TooltipContent>
              </Button>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" className="cursor-pointer">
                <Trash className="w-4 h-4" strokeWidth={1.5} />
                <TooltipContent>Delete</TooltipContent>
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </div>
      )
    },
  },
]
