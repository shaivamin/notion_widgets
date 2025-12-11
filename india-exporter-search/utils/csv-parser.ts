import Papa from 'papaparse'

export interface CSVRow {
  [key: string]: string
}

export async function parseCSVFile(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as CSVRow[])
      },
      error: (error: any) => {
        reject(error)
      },
    })
  })
}

export async function parseCSVFromURL(url: string): Promise<CSVRow[]> {
  const response = await fetch(url)
  const csvText = await response.text()
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as CSVRow[])
      },
      error: (error: any) => {
        reject(error)
      },
    })
  })
}

export function cleanCSVValue(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value.trim().replace(/\s+/g, ' ')
}

export function parseNumberFromCSV(value: string | undefined): number | undefined {
  if (!value) return undefined
  const cleaned = value.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? undefined : parsed
}

export function parseArrayFromCSV(value: string | undefined, delimiter: string = ','): string[] {
  if (!value) return []
  return value
    .split(delimiter)
    .map(item => item.trim())
    .filter(item => item.length > 0)
}
