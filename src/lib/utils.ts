import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertNumberToWords(num: number): string {
  const units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ]
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ]

  function convertLessThanOneThousand(num: number): string {
    if (num === 0) {
      return ''
    }

    let result = ''

    if (num >= 100) {
      result += units[Math.floor(num / 100)] + ' Hundred'
      if (num % 100 !== 0) {
        result += ' And '
      }
    }

    num %= 100
    if (num >= 10 && num < 20) {
      result += teens[num - 10]
    } else {
      const tenDigit = Math.floor(num / 10)
      const unitDigit = num % 10
      if (tenDigit > 0) {
        result += tens[tenDigit]
        if (unitDigit > 0) {
          result += ' ' + units[unitDigit]
        }
      } else if (unitDigit > 0) {
        result += units[unitDigit]
      }
    }

    return result
  }

  if (num === 0) {
    return 'Zero'
  }

  let result = ''
  const crores = Math.floor(num / 10000000)
  num %= 10000000
  const lakhs = Math.floor(num / 100000)
  num %= 100000
  const thousands = Math.floor(num / 1000)
  num %= 1000

  if (crores > 0) {
    result += convertLessThanOneThousand(crores) + ' Crore '
  }

  if (lakhs > 0) {
    result += convertLessThanOneThousand(lakhs) + ' Lakh '
  }

  if (thousands > 0) {
    result += convertLessThanOneThousand(thousands) + ' Thousand '
  }

  if (num > 0) {
    result += convertLessThanOneThousand(num)
  }

  return result.trim()
}
