import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatTime(time: string): string {
  return time.replace(':', 'h')
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

export function calculateWorkDays(
  startDate: Date,
  endDate: Date
): number {
  let count = 0
  const current = new Date(startDate)
  while (current <= endDate) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

export function isMinimumRestRespected(
  endPreviousShift: Date,
  startNextShift: Date,
  minimumHours: number = 11
): boolean {
  const diffMs = startNextShift.getTime() - endPreviousShift.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours >= minimumHours
}
