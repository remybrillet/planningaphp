'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Users,
  Clock,
  Download,
  BarChart3,
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

const reports = [
  {
    id: 'planning-mensuel',
    title: 'Planning mensuel',
    description: 'Export du planning complet pour un mois donné avec tous les agents et shifts.',
    icon: Calendar,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'heures-travaillees',
    title: 'Heures travaillées',
    description: 'Récapitulatif des heures par agent sur une période choisie.',
    icon: Clock,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'solde-conges',
    title: 'Solde de congés',
    description: 'État des congés par agent : CP, RTT, maladie, formation.',
    icon: Users,
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'taux-absenteisme',
    title: "Taux d'absentéisme",
    description: "Analyse du taux d'absentéisme par période et par type d'absence.",
    icon: BarChart3,
    formats: ['PDF'],
  },
]

export function RapportsView() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )
  const [generating, setGenerating] = useState<string | null>(null)

  const handleExport = async (reportId: string, format: string) => {
    setGenerating(`${reportId}-${format}`)

    try {
      const res = await fetch(
        `/api/exports/${reportId}?month=${selectedMonth}&format=${format.toLowerCase()}`
      )

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportId}-${selectedMonth}.${format === 'Excel' ? 'xlsx' : 'pdf'}`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setGenerating(null)
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Period selector */}
      <motion.div variants={fadeUp} className="mb-6">
        <label
          htmlFor="month-select"
          className="block text-sm font-medium text-secondary-700 mb-1.5"
        >
          Période
        </label>
        <input
          id="month-select"
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
        />
      </motion.div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <motion.div key={report.id} variants={fadeUp}>
            <Card hoverable>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <report.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-800 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-secondary-500 mb-4">
                      {report.description}
                    </p>
                    <div className="flex gap-2">
                      {report.formats.map((format) => (
                        <Button
                          key={format}
                          variant="outline"
                          size="sm"
                          icon={
                            format === 'PDF' ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            )
                          }
                          isLoading={generating === `${report.id}-${format}`}
                          onClick={() => handleExport(report.id, format)}
                        >
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
