import { useState } from 'react'
import type { CreateAppointmentInput } from '../types'
import { Heart, Baby, Cross, MessageCircle } from 'lucide-react'

type Props = {
  onSubmit: (input: CreateAppointmentInput) => Promise<void> | void
}

export default function AppointmentForm({ onSubmit }: Props) {
  const [form, setForm] = useState<CreateAppointmentInput>({
    customerName: '',
    service: '',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    profession: '',
    idNumber: '',
    email: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(form)
      setForm({
        customerName: '',
        service: '',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        profession: '',
        idNumber: '',
        email: '',
        notes: ''
      })
    } finally {
      setSubmitting(false)
    }
  }

  const serviceOptions = [
    { value: 'wedding', label: 'Wedding', icon: <Heart size={16} /> },
    { value: 'baptism', label: 'Baptism', icon: <Baby size={16} /> },
    { value: 'funeral', label: 'Funeral', icon: <Cross size={16} /> },
    { value: 'counseling', label: 'Counseling', icon: <MessageCircle size={16} /> }
  ]

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <input
        placeholder="Customer name"
        value={form.customerName}
        onChange={e => setForm(prev => ({ ...prev, customerName: e.target.value }))}
        required
      />
      <select
        value={form.service}
        onChange={e => setForm(prev => ({ ...prev, service: e.target.value }))}
        required
        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        <option value="">Select Service</option>
        {serviceOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={form.startDate.slice(0, 10)}
        onChange={e => setForm(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
        required
      />
      <input
        type="date"
        value={form.endDate.slice(0, 10)}
        onChange={e => setForm(prev => ({ ...prev, endDate: new Date(e.target.value).toISOString() }))}
        required
      />

      <input
        placeholder="Profession (optional)"
        value={form.profession}
        onChange={e => setForm(prev => ({ ...prev, profession: e.target.value }))}
      />
      <input
        type="email"
        placeholder="Email Address (optional)"
        value={form.email}
        onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
      />
      <input
        placeholder="ID Number"
        value={form.idNumber}
        onChange={e => setForm(prev => ({ ...prev, idNumber: e.target.value }))}
        required
      />
      <textarea
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
      />
      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Create appointment'}</button>
    </form>
  )
}
