export type Invoice = {
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

export type Company = {
  id: number
  name: string
  payment_terms: string | null
  gst_number: string
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
