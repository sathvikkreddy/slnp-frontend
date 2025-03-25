export interface StrapiCollection {
  documentId: string
}

export interface Invoice extends StrapiCollection {
  id: number
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
  bill_to_company: Company
  ship_to_company: Company
  items: InvoiceItem[]
}

export interface Company extends StrapiCollection {
  id: number
  name: string
  payment_terms: string | null
  gst_number: string
  address: Address
}

export type Address = {
  id: number
  address_line_1: string
  address_line_2: string
  address_line_3: string
  state: string
  state_code: number
}

export type InvoiceItem = {
  id: number
  title: string
  hsn_code: string
  quantity: number
  unit: string
  amount: number
  unit_price: number
  description_line_1: string | null
  description_line_2: string | null
  description_line_3: string | null
}

export interface Payment extends StrapiCollection {
  id: number
  company: Company
  amount: number
  payment_method: PaymentMethod
  received_to?: string
  invoice?: Invoice
  date: string
}

export type PaymentMethod = 'cash' | 'cheque' | 'net-banking' | 'upi' | 'other'

export interface Purchase extends StrapiCollection {
  id: number
  date: string
  invoice_number: string
  taxable_amount: string
  cgst_amount: string
  sgst_amount: string
  igst_amount: string
  total_amount: string
  company: Company
}
