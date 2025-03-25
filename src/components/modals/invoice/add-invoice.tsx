import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Company, Invoice, InvoiceItem } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCompanies } from '@/api/companies'
import { createInvoice } from '@/api/invoices'
import { toast } from 'sonner'
import { VariantProps } from 'class-variance-authority'

// Units for dropdown
const units = ['NOS', 'KGS']

export function AddInvoiceDialog({
  label,
  className,
  existingInvoice,
  buttonProps,
  asChild,
}: {
  label?: string
  className?: string
  existingInvoice?: Invoice
  buttonProps?: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
  asChild?: boolean
}) {
  const [open, setOpen] = useState(false)
  const { data: companies, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  })
  const queryClient = useQueryClient()
  const { mutateAsync: createInvoiceMutate, isPending: createInvoicePending } =
    useMutation({
      mutationKey: ['invoices'],
      mutationFn: createInvoice,
      onSuccess: (data) => {
        toast(`Invoice No: ${data?.invoice_number} created`)
        queryClient.invalidateQueries({ queryKey: ['invoices'] })
        setOpen(false)
      },
      onError: (error) => {
        console.log('error while creating: ', error)
      },
    })
  // Initialize form with default values
  const form = useForm<AddInvoice>({
    defaultValues: {
      invoice_number: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      purchase_order: existingInvoice?.purchase_order ?? '',
      total_quantity: existingInvoice?.total_quantity ?? 0,
      total_amount: existingInvoice?.total_amount ?? 0,
      transport_amount: existingInvoice?.transport_amount ?? 0,
      taxable_amount: existingInvoice?.taxable_amount ?? 0,
      sgst_amount: existingInvoice?.sgst_amount ?? 0,
      cgst_amount: existingInvoice?.cgst_amount ?? 0,
      igst_amount: existingInvoice?.igst_amount ?? 0,
      round_off_amount: existingInvoice?.round_off_amount ?? 0,
      invoice_amount: existingInvoice?.invoice_amount ?? 0,
      eway_bill_number: '',
      vehicle_number: existingInvoice?.vehicle_number ?? '',
      bill_to_company: existingInvoice?.bill_to_company.id ?? 0,
      ship_to_company: existingInvoice?.ship_to_company.id ?? 0,
      items: existingInvoice?.items ?? [
        {
          title: 'HDPE PP WOVEN SACKS',
          hsn_code: '39239090',
          quantity: 0,
          unit: 'NOS',
          amount: 0,
          unit_price: 0,
          description_line_1: '',
          description_line_2: '',
          description_line_3: '',
        },
      ],
    },
  })

  const { control, handleSubmit } = form
  const [billToCompany, setBillToCompany] = useState<Company | null>(
    existingInvoice?.bill_to_company ?? null
  )
  const [shipToCompany, setShipToCompany] = useState<Company | null>(
    existingInvoice?.ship_to_company ?? null
  )
  // Field array for invoice items
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  if (!companies) {
    return <div>Error Occured</div>
  }
  // Calculate totals when items change
  const calculateTotals = (items: AddInvoiceItem[]) => {
    const totalQuantity = items.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    )
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    )

    form.setValue('total_quantity', totalQuantity)
    form.setValue('total_amount', totalAmount)
    form.setValue('taxable_amount', totalAmount)

    if (billToCompany?.gst_number.substring(0, 2) === '36') {
      const sgstAmount = Number((totalAmount * 0.09).toFixed(2))
      const cgstAmount = Number((totalAmount * 0.09).toFixed(2))
      form.setValue('sgst_amount', sgstAmount)
      form.setValue('cgst_amount', cgstAmount)
      form.setValue('igst_amount', 0)
    } else {
      const igstAmount = totalAmount * 0.18
      form.setValue('sgst_amount', 0)
      form.setValue('cgst_amount', 0)
      form.setValue('igst_amount', igstAmount)
    }

    // Calculate invoice amount
    const transportAmount = Number(form.getValues('transport_amount'))
    const sgstAmount = Number(form.getValues('sgst_amount'))
    const cgstAmount = Number(form.getValues('cgst_amount'))
    const igstAmount = Number(form.getValues('igst_amount'))

    const invoiceAmount = Number(
      (
        totalAmount +
        transportAmount +
        sgstAmount +
        cgstAmount +
        igstAmount
      ).toFixed(2)
    )
    console.log(invoiceAmount)
    // Round off to nearest rupee
    const roundOffAmount = Number(
      (Math.round(invoiceAmount) - invoiceAmount).toFixed(2)
    )
    form.setValue('round_off_amount', roundOffAmount)
    form.setValue('invoice_amount', Math.round(invoiceAmount))
  }

  // Handle item changes
  const handleItemChange = (
    index: number,
    field: keyof AddInvoiceItem,
    value: any
  ) => {
    const items = form.getValues('items')

    if (field === 'quantity' || field === 'unit_price') {
      const quantity =
        field === 'quantity' ? Number(value) : Number(items[index].quantity)
      const unitPrice =
        field === 'unit_price' ? Number(value) : Number(items[index].unit_price)
      const amount = quantity * unitPrice

      form.setValue(`items.${index}.amount`, amount)
    }

    // Recalculate totals after a short delay to ensure all values are updated
    setTimeout(() => calculateTotals(form.getValues('items')), 100)
  }

  const onSubmit = async (data: AddInvoice) => {
    console.log('Form submitted:', data)
    await createInvoiceMutate({
      ...data,
      invoice_number: `SLNP/${format(getThisFinancialYear().from, 'yyyy')}-
                        ${format(getThisFinancialYear().to, 'yy')}/${
        data.invoice_number
      }`,
    })
    // Here you would typically send the data to your API
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(className)} asChild={asChild}>
        <Button {...buttonProps}>{label ?? 'Add New Invoice'}</Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Invoice</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new invoice.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="invoice_number"
                rules={{
                  required: 'Required',
                  pattern: {
                    value: /^[A-Za-z0-9/-]+$/,
                    message: 'Invalid format',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        SLNP/{format(getThisFinancialYear().from, 'yyyy')}-
                        {format(getThisFinancialYear().to, 'yy')}/
                      </p>
                      <FormControl>
                        <Input {...field} className="w-2/5" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="date"
                rules={{ required: 'Required' }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, 'yyyy-MM-dd') : ''
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="purchase_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Order (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bill To Company */}
              <Card>
                <CardHeader>
                  <CardTitle>Bill To</CardTitle>
                  <CardDescription>Select the billing company</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="bill_to_company"
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        {isCompaniesLoading ? (
                          <div className="">
                            <Loader2 className="w-8 h-8 animate-spin" />
                          </div>
                        ) : (
                          <Select
                            onValueChange={(value) => {
                              const company = companies.find(
                                (c) => c.id === Number.parseInt(value)
                              )
                              if (company) {
                                form.setValue('bill_to_company', company.id)
                                // Recalculate tax after company change
                                setBillToCompany(company)
                                calculateTotals(form.getValues('items'))
                              }
                            }}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem
                                  key={company.id}
                                  value={company.id.toString()}
                                >
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Input
                    className="mt-4"
                    value={billToCompany?.gst_number}
                    readOnly
                  />
                </CardContent>
              </Card>

              {/* Ship To Company */}
              <Card>
                <CardHeader>
                  <CardTitle>Ship To</CardTitle>
                  <CardDescription>Select the shipping company</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="ship_to_company"
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            const company = companies.find(
                              (c) => c.id === Number.parseInt(value)
                            )
                            if (company) {
                              form.setValue('ship_to_company', company.id)
                              // Recalculate tax after company change
                              setShipToCompany(company)
                              calculateTotals(form.getValues('items'))
                            }
                          }}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem
                                key={company.id}
                                value={company.id.toString()}
                              >
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Input
                    className="mt-4"
                    value={shipToCompany?.gst_number}
                    readOnly
                  />
                </CardContent>
              </Card>
            </div>

            {/* Transport Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="eway_bill_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-way Bill Number</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="vehicle_number"
                rules={{
                  required: 'Required',
                  pattern: {
                    value: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
                    message: 'Invalid format (e.g., TS02AB1234)',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Invoice Items</h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    append({
                      title: 'HDPE PP WOVEN SACKS',
                      hsn_code: '39239090',
                      quantity: 0,
                      unit: 'NOS',
                      amount: 0,
                      unit_price: 0,
                      description_line_1: '',
                      description_line_2: '',
                      description_line_3: '',
                    })
                  }}
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <FormField
                        control={control}
                        name={`items.${index}.title`}
                        rules={{ required: 'Required' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`items.${index}.hsn_code`}
                        rules={{ required: 'Required' }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HSN Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={control}
                          name={`items.${index}.quantity`}
                          rules={{
                            required: 'Required',
                            min: {
                              value: 0.01,
                              message: 'Min value: 1',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  step="0.01"
                                  onChange={(e) => {
                                    field.onChange(e)
                                    handleItemChange(
                                      index,
                                      'quantity',
                                      e.target.value
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`items.${index}.unit`}
                          rules={{ required: 'Required' }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {units.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <FormField
                        control={control}
                        name={`items.${index}.unit_price`}
                        rules={{
                          required: 'Required',
                          min: {
                            value: 0.01,
                            message: 'Must be greater than 0',
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleItemChange(
                                    index,
                                    'unit_price',
                                    e.target.value
                                  )
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                readOnly
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormField
                        control={control}
                        name={`items.${index}.description_line_1`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ''}
                                placeholder="Line 1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`items.${index}.description_line_2`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ''}
                                placeholder="Line 2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`items.${index}.description_line_3`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ''}
                                placeholder="Line 3"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {fields.length > 1 && (
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500"
                          onClick={() => {
                            remove(index)
                            // Recalculate totals after removing item
                            setTimeout(
                              () => calculateTotals(form.getValues('items')),
                              100
                            )
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Amounts */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Amounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={control}
                    name="total_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Quantity</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="total_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="transport_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            onChange={(e) => {
                              field.onChange(e)
                              calculateTotals(form.getValues('items'))
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={control}
                    name="taxable_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxable Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="sgst_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SGST Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="cgst_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGST Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={control}
                    name="igst_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IGST Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="round_off_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Round Off Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="invoice_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            readOnly
                            className="font-bold"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="submit">
                Create Invoice{' '}
                {createInvoicePending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

type AddInvoiceItem = Omit<InvoiceItem, 'id'>
export type AddInvoice = {
  invoice_number: string
  date: string
  purchase_order: string | null
  total_quantity: number
  total_amount: number
  transport_amount: number
  taxable_amount: number
  sgst_amount: number
  cgst_amount: number
  igst_amount: number
  round_off_amount: number
  invoice_amount: number
  eway_bill_number: string | null
  vehicle_number: string
  bill_to_company: number
  ship_to_company: number
  items: AddInvoiceItem[]
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
