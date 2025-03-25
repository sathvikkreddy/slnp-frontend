import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { CalendarIcon, ChevronDown, FileText, FileX, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { addMonths, format, lastDayOfMonth, setDate } from 'date-fns'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { AddInvoiceDialog } from '../modals/invoice/add-invoice'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'bill_to_company', value: '' },
    { id: 'date', value: undefined },
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ship_to_company: false,
    ship_to_company_gst_number: false,
  })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageSize: 25, pageIndex: 0 },
    },
  })
  const date = columnFilters[1]?.value
    ? (columnFilters[1]?.value as DateRange)
    : undefined
  return (
    <div className="rounded-md border">
      <div className="border-b-1 p-2 flex gap-2 justify-between items-center bg-accent">
        <div className="text-2xl">Invoices</div>
        <div className="flex flex-1/2 gap-2 justify-end items-center">
          <Input
            value={
              table.getColumn('bill_to_company')?.getFilterValue() as string
            }
            onChange={(e) => {
              table.getColumn('bill_to_company')?.setFilterValue(e.target.value)
            }}
            className="w-1/3 bg-background"
            placeholder="Search bill to company, invoice number"
          />
          <div className={cn('grid gap-2')}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-[300px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(value) => {
                    setColumnFilters((prev) => {
                      const otherFilters = prev.filter((f) => f.id !== 'date')
                      return [...otherFilters, { id: 'date', value: value }]
                    })
                  }}
                  numberOfMonths={2}
                />
                <div className="p-2 flex items-center justify-around">
                  {/* This Month */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setColumnFilters((prev) => {
                        const otherFilters = prev.filter((f) => f.id !== 'date')
                        return [
                          ...otherFilters,
                          {
                            id: 'date',
                            value: {
                              from: setDate(new Date(), 1), // 1st of last month
                              to: lastDayOfMonth(new Date()), // last day of this month
                            },
                          },
                        ]
                      })
                    }
                  >
                    {format(new Date(), 'MMMM-yy')}
                  </Button>
                  {/* Previous Month */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setColumnFilters((prev) => {
                        const otherFilters = prev.filter((f) => f.id !== 'date')
                        return [
                          ...otherFilters,
                          {
                            id: 'date',
                            value: {
                              from: setDate(addMonths(new Date(), -1), 1), // 1st of last month
                              to: lastDayOfMonth(addMonths(new Date(), -1)), // last day of previous month
                            },
                          },
                        ]
                      })
                    }
                  >
                    {format(addMonths(new Date(), -1), 'MMMM-yy')}
                  </Button>
                  {/* This F.Y. */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const fy = getThisFinancialYear()

                      setColumnFilters((prev) => {
                        const otherFilters = prev.filter((f) => f.id !== 'date')
                        return [
                          ...otherFilters,
                          {
                            id: 'date',
                            value: fy,
                          },
                        ]
                      })
                    }}
                  >
                    {format(getThisFinancialYear().from, 'yyyy')} -{' '}
                    {format(getThisFinancialYear().to, 'yy')}
                  </Button>
                  {/* Previous F.Y. */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const prevFy = getPreviousFinancialYear()

                      setColumnFilters((prev) => {
                        const otherFilters = prev.filter((f) => f.id !== 'date')
                        return [
                          ...otherFilters,
                          {
                            id: 'date',
                            value: prevFy,
                          },
                        ]
                      })
                    }}
                  >
                    {format(getPreviousFinancialYear().from, 'yyyy')} -{' '}
                    {format(getPreviousFinancialYear().to, 'yy')}
                  </Button>
                  {/* Clear */}
                  <Button
                    onClick={() => {
                      setColumnFilters((prev) => {
                        const otherFilters = prev.filter((f) => f.id !== 'date')
                        return [
                          ...otherFilters,
                          {
                            id: 'date',
                            value: undefined,
                          },
                        ]
                      })
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Export <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportToCSV(table, true)}>
                <FileX className="w-4 h-4 text-green-500" /> Export current
                selection (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCSV(table, false)}>
                <FileX className="w-4 h-4 text-green-500" /> Export all data
                (.csv)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Coming Soon</DropdownMenuLabel>
              <DropdownMenuItem
                disabled
                onClick={() => exportToPDF(table, true)}
              >
                <FileText className="w-4 h-4 text-red-500" />
                Export current selection (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled
                onClick={() => exportToPDF(table, false)}
              >
                <FileText className="w-4 h-4 text-red-500" />
                Export all data (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className=" h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace(/_/g, ' ')}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((footer) => {
                return (
                  <TableHead className="text-accent-foreground" key={footer.id}>
                    {footer.isPlaceholder
                      ? null
                      : flexRender(
                          footer.column.columnDef.footer,
                          footer.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
      <div className="flex justify-between space-x-2 p-4 bg-accent">
        <AddInvoiceDialog />
        <div className="flex items-center justify-end gap-2">
          <p className="text-sm">
            Rows: {table.getRowModel().rows.length} of {table.getRowCount()}
          </p>
          <p className="text-sm">
            Page: {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

const getThisFinancialYear = () => {
  const today = new Date()
  const year = today.getFullYear()

  const isBeforeApril = today.getMonth() < 3 // Jan=0, Feb=1, Mar=2
  const fromYear = isBeforeApril ? year - 1 : year
  const toYear = isBeforeApril ? year : year + 1

  return {
    from: new Date(fromYear, 3, 1), // April 1
    to: new Date(toYear, 2, 31), // March 31
  }
}

const getPreviousFinancialYear = () => {
  const today = new Date()
  const year = today.getFullYear()

  const isBeforeApril = today.getMonth() < 3
  const fromYear = isBeforeApril ? year - 2 : year - 1
  const toYear = isBeforeApril ? year - 1 : year

  return {
    from: new Date(fromYear, 3, 1), // April 1
    to: new Date(toYear, 2, 31), // March 31
  }
}

function exportToCSV(table: any, exportFiltered: boolean) {
  // Get visible columns
  const visibleColumns = table
    .getAllColumns()
    .filter((column: any) => column.getIsVisible())

  // Get header row
  const headerRow = visibleColumns.map((column: any) => {
    // Convert column ID to a more readable format (replace underscores with spaces)
    return column.id.replace(/_/g, ' ')
  })
  const footerRow = visibleColumns.map((column: any) => {
    // Convert column ID to a more readable format (replace underscores with spaces)
    switch (column.id) {
      case 'taxable_amount':
        return table
          .getRowModel()
          .rows.reduce(
            (total: number, row: any) => total + row.original.taxable_amount,
            0
          )
      case 'cgst_amount':
        return table
          .getRowModel()
          .rows.reduce(
            (total: number, row: any) => total + row.original.cgst_amount,
            0
          )
      case 'sgst_amount':
        return table
          .getRowModel()
          .rows.reduce(
            (total: number, row: any) => total + row.original.sgst_amount,
            0
          )
      case 'igst_amount':
        return table
          .getRowModel()
          .rows.reduce(
            (total: number, row: any) => total + row.original.igst_amount,
            0
          )
      case 'invoice_amount':
        return table
          .getRowModel()
          .rows.reduce(
            (total: number, row: any) => total + row.original.invoice_amount,
            0
          )
      default:
        break
    }
    return 0
  })
  // Get data rows
  let dataRows
  if (exportFiltered) {
    // Export only filtered/visible data
    dataRows = table.getFilteredRowModel().rows.map((row: any) => {
      return visibleColumns.map((column: any) => {
        // Get the formatted cell value
        const cell = row
          .getVisibleCells()
          .find(
            (cell: any) =>
              cell.column.id === column.id && cell.column.id !== 'row_actions'
          )
        if (!cell) return ''

        // Try to get the rendered value, or fall back to the raw value
        let value = ''
        try {
          const rendered = cell.column.columnDef.cell(cell.getContext())
          // If the rendered value is a React element, try to extract text content
          if (typeof rendered === 'object' && rendered !== null) {
            value = rendered?.props?.children || cell.getValue() || ''
          } else {
            value = rendered || cell.getValue() || ''
          }
        } catch {
          value = cell.getValue() || ''
        }

        // Convert to string and escape quotes
        return String(value).replace(/"/g, '""')
      })
    })
  } else {
    // Export all data without filters
    dataRows = table.getCoreRowModel().rows.map((row: any) => {
      return visibleColumns.map((column: any) => {
        const cell = row
          .getVisibleCells()
          .find(
            (cell: any) =>
              cell.column.id === column.id && cell.column.id !== 'row_actions'
          )
        if (!cell) return ''

        let value = ''
        try {
          const rendered = cell.column.columnDef.cell(cell.getContext())
          if (typeof rendered === 'object' && rendered !== null) {
            value = rendered?.props?.children || cell.getValue() || ''
          } else {
            value = rendered || cell.getValue() || ''
          }
        } catch {
          value = cell.getValue() || ''
        }

        return String(value).replace(/"/g, '""')
      })
    })
  }

  // Combine header and data rows
  const csvContent = [
    headerRow.join(','),
    ...dataRows.map((row: any) => row.join(',')),
    footerRow.join(','),
  ].join('\n')

  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `invoice-data-${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportToPDF(table: any, exportFiltered: boolean) {
  // Create a new PDF document
  const doc = new jsPDF()

  // Get visible columns
  const visibleColumns = table
    .getAllColumns()
    .filter((column: any) => column.getIsVisible())

  // Get header row
  const headerRow = visibleColumns.map((column: any) => {
    // Convert column ID to a more readable format (replace underscores with spaces)
    return column.id.replace(/_/g, ' ')
  })

  // Get data rows
  let dataRows
  if (exportFiltered) {
    // Export only filtered/visible data
    dataRows = table.getFilteredRowModel().rows.map((row: any) => {
      return visibleColumns.map((column: any) => {
        // Get the formatted cell value
        const cell = row
          .getVisibleCells()
          .find((cell: any) => cell.column.id === column.id)
        if (!cell) return ''

        // Try to get the rendered value, or fall back to the raw value
        let value = ''
        try {
          const rendered = cell.column.columnDef.cell(cell.getContext())
          // If the rendered value is a React element, try to extract text content
          if (typeof rendered === 'object' && rendered !== null) {
            value = rendered?.props?.children || cell.getValue() || ''
          } else {
            value = rendered || cell.getValue() || ''
          }
        } catch {
          value = cell.getValue() || ''
        }

        return String(value)
      })
    })
  } else {
    // Export all data without filters
    dataRows = table.getCoreRowModel().rows.map((row: any) => {
      return visibleColumns.map((column: any) => {
        const cell = row
          .getVisibleCells()
          .find((cell: any) => cell.column.id === column.id)
        if (!cell) return ''

        let value = ''
        try {
          const rendered = cell.column.columnDef.cell(cell.getContext())
          if (typeof rendered === 'object' && rendered !== null) {
            value = rendered?.props?.children || cell.getValue() || ''
          } else {
            value = rendered || cell.getValue() || ''
          }
        } catch {
          value = cell.getValue() || ''
        }

        return String(value)
      })
    })
  }

  // Add title to the PDF
  doc.text('Invoice Data', 14, 15)

  // Add date
  const today = new Date()
  doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, 22)

  // Add table to the PDF
  ;(doc as any).autoTable({
    head: [headerRow],
    body: dataRows,
    startY: 30,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  })

  // Save the PDF
  doc.save(`invoice-data-${today.toISOString().split('T')[0]}.pdf`)
}
