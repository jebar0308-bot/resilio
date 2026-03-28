'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Contract = {
  id: string
  category: string
  provider: string
  monthly_price: number
  renewal_date: string
}

function getDaysUntil(dateString: string) {
  const today = new Date()
  const target = new Date(dateString)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatus(days: number) {
  if (days <= 30) return 'À optimiser'
  if (days <= 90) return 'À surveiller'
  return 'OK'
}

export default function AlertsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      const userRes = await supabase.auth.getUser()
      const user = userRes.data.user

      if (!user) return

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('renewal_date', { ascending: true })

      if (!error) {
        setContracts(data || [])
      }
    }

    fetchAlerts()
  }, [])

  const urgent = contracts.filter((c) => getDaysUntil(c.renewal_date) <= 30)
  const watch = contracts.filter((c) => {
    const days = getDaysUntil(c.renewal_date)
    return days > 30 && days <= 90
  })

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <a href="/" style={{ textDecoration: 'none', color: '#666' }}>
        ← Retour
      </a>

      <h1 style={{ marginTop: 10 }}>Alertes</h1>

      <div style={{ marginTop: 20 }}>
        <h2>Urgent</h2>
        {urgent.length === 0 ? (
          <p style={{ color: '#666' }}>Aucune alerte urgente.</p>
        ) : (
          urgent.map((contract) => (
            <div key={contract.id} style={cardStyle}>
              <h3 style={{ margin: 0 }}>{contract.category}</h3>
              <p style={{ color: '#666' }}>{contract.provider}</p>
              <p><strong>{getStatus(getDaysUntil(contract.renewal_date))}</strong></p>
              <a href={`/compare/${contract.id}`}>Voir les offres</a>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <h2>À surveiller</h2>
        {watch.length === 0 ? (
          <p style={{ color: '#666' }}>Aucune alerte à surveiller.</p>
        ) : (
          watch.map((contract) => (
            <div key={contract.id} style={cardStyle}>
              <h3 style={{ margin: 0 }}>{contract.category}</h3>
              <p style={{ color: '#666' }}>{contract.provider}</p>
              <p><strong>{getStatus(getDaysUntil(contract.renewal_date))}</strong></p>
              <a href={`/compare/${contract.id}`}>Voir les offres</a>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
}