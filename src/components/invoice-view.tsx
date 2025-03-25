import type { Invoice } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { useRef } from 'react'
import { convertNumberToWords } from '@/lib/utils'

interface InvoiceViewProps {
  invoice: Invoice
}

export default function InvoiceView({ invoice }: InvoiceViewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload()
    }
  }

  return (
    <div className="container mx-auto my-8 max-w-5xl px-4">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">
          Invoice #{invoice.invoice_number}
        </h1>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      <Card className="overflow-hidden bg-white p-0">
        <div ref={printRef} className="p-8">
          {/* Company Header */}
          <div className="border-b border-gray-200 pb-2 text-center">
            <h1 className="text-2xl font-bold uppercase">
              SAI LAKSHMI NARASIMHA PACKAGINGS
            </h1>
            <p>
              Survey No. 75, Plot No. 48, Suraram, IDA Jeedimetla, Hyderabad
            </p>
            <p>Email ID: slnpackagings@gmail.com, Cell No.: 9000780007</p>
            <p>GSTIN: 36CVWPK4641J1ZX</p>
          </div>

          {/* Invoice Type */}
          {/* <div className="mt-2 flex justify-center space-x-8">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full border border-black p-0.5">
                <div className="h-full w-full rounded-full bg-black"></div>
              </div>
              <span className="ml-2">Original</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full border border-black p-0.5"></div>
              <span className="ml-2">Duplicate</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full border border-black p-0.5"></div>
              <span className="ml-2">Triplicate</span>
            </div>
          </div> */}
          <p className="mt-1 text-center text-xs">( Under Rule 7 GST )</p>

          {/* Invoice Title */}
          <h2 className="text-xl font-bold text-center">TAX INVOICE</h2>

          {/* Invoice Details */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-semibold">Invoice No:</span>{' '}
                {invoice.invoice_number}
              </p>
              <p>
                <span className="font-semibold">State:</span> Telangana
                <span className="ml-4 font-semibold">Code:</span> 36
              </p>
              <p>
                <span className="font-semibold">P.O NO & DATE:</span>{' '}
                {invoice.purchase_order || 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p>
                <span className="font-semibold">Invoice Date:</span>{' '}
                {invoice.date}
              </p>
              <p>
                <span className="font-semibold">Vehicle No:</span>{' '}
                {invoice.vehicle_number}
              </p>
              <p>
                <span className="font-semibold">E-Way Bill No:</span>{' '}
                {invoice.eway_bill_number || 'N/A'}
              </p>
            </div>
          </div>

          {/* Company Details */}
          <div className="mt-2 grid grid-cols-2 gap-8">
            {/* Bill To */}
            <div className="rounded border border-gray-300 p-2">
              <div className="text-lg font-semibold">
                Bill to: {invoice.bill_to_company.name}
              </div>
              <div>{invoice.bill_to_company.address.address_line_1}</div>
              <div>{invoice.bill_to_company.address.address_line_2}</div>
              <div>{invoice.bill_to_company.address.address_line_3}</div>
              <div>GSTIN: {invoice.bill_to_company.gst_number}</div>
              <div>
                State: {invoice.bill_to_company.address.state} Code:{' '}
                {invoice.bill_to_company.address.state_code}{' '}
              </div>
            </div>

            {/* Ship To */}
            <div className="rounded border border-gray-300 p-2">
              <div className="text-lg font-semibold">
                Ship to: {invoice.ship_to_company.name}
              </div>
              <div>{invoice.ship_to_company.address.address_line_1}</div>
              <div>{invoice.ship_to_company.address.address_line_2}</div>
              <div>{invoice.ship_to_company.address.address_line_3}</div>
              <div>GSTIN: {invoice.ship_to_company.gst_number}</div>
              <div>
                State: {invoice.ship_to_company.address.state} Code:{' '}
                {invoice.ship_to_company.address.state_code}{' '}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">
                    Sl. No
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Product Description
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    HSN Code
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    Quantity
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Units
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      <div className="font-medium">{item.title}</div>
                      {item.description_line_1 && (
                        <div>{item.description_line_1}</div>
                      )}
                      {item.description_line_2 && (
                        <div>{item.description_line_2}</div>
                      )}
                      {item.description_line_3 && (
                        <div>{item.description_line_3}</div>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.hsn_code}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">{item.unit}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      {item.unit_price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={3}
                    className="border border-gray-300 p-2 text-right font-semibold"
                  >
                    Total Quantity:
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-semibold">
                    {invoice.total_quantity}
                  </td>
                  <td
                    colSpan={2}
                    className="border border-gray-300 p-2 text-right font-semibold"
                  >
                    Total:
                  </td>
                  <td className="border border-gray-300 p-2 text-right font-semibold">
                    {invoice.taxable_amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount Details */}
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold">
                Amount (in words):{' '}
                <span className="font-normal italic">
                  {convertNumberToWords(invoice.invoice_amount)} Only
                </span>
              </p>

              <div className="mt-4 rounded border border-gray-300 p-3">
                <p className="font-semibold">Bank Details:</p>
                <p>
                  <span className="font-semibold">Name:</span> Union Bank Of
                  India
                </p>
                <p>
                  <span className="font-semibold">Branch:</span> HMT INDL.EST.,
                  Hyderabad, Telangana
                </p>
                <p>
                  <span className="font-semibold">A/C No.:</span> 0212 1110 0003
                  378
                </p>
                <p>
                  <span className="font-semibold">IFSC:</span> UBIN0802123
                </p>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Note:</p>
                <ol className="list-decimal pl-5">
                  <li>
                    Terms of Payment:{' '}
                    {invoice.bill_to_company.payment_terms || 'N/A'}
                  </li>
                  <li>Goods once sold cannot be accepted in return</li>
                  <li>Subject to Hyderabad Jurisdiction Only</li>
                </ol>
              </div>
            </div>

            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 text-left">Transport:</td>
                    <td className="py-1 text-right">
                      {invoice.transport_amount?.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left">Amount:</td>
                    <td className="py-1 text-right">
                      {invoice.taxable_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left">CGST : 9%:</td>
                    <td className="py-1 text-right">
                      {invoice.cgst_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left">SGST : 9%:</td>
                    <td className="py-1 text-right">
                      {invoice.sgst_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left">IGST : 18%:</td>
                    <td className="py-1 text-right">
                      {invoice.igst_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-left">Round off:</td>
                    <td className="py-1 text-right">
                      {invoice.round_off_amount.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="border-t border-gray-300 py-2 text-left">
                      Total Amount:
                    </td>
                    <td className="border-t border-gray-300 py-2 text-right">
                      {invoice.invoice_amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-8 text-center">
                <p>
                  Certified that the particulars given above are true and
                  correct
                </p>
                <p className="mt-1 font-semibold">
                  For SAI LAKHSMI NARASIMHA PACKAGINGS
                </p>
                <div className="mt-12">
                  <p>Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
