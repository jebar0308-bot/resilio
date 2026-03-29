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

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
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
    <div
      style={{
        minHeight: '100vh',
        padding: 20,
        paddingBottom: 110,
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <a href="/" style={{ color: '#6b7280' }}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280' }}>Centre d’alertes</p>
          <h1>Vos opportunités</h1>
        </div>

        <div
          className="premium-card fade-in"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            marginBottom: 18,
          }}
        >
          <p style={{ color: '#6b7280', margin: 0 }}>Alertes actives</p>
          <h2 style={{ fontSize: 40, margin: '10px 0 8px' }}>
            {urgent.length + watch.length}
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Contrats à surveiller ou à optimiser
          </p>
        </div>

        <Section title="Urgent" items={urgent} />
        <Section title="À surveiller" items={watch} />
      </div>

      <div style={tabBarStyle}>
        <a href="/" style={tabItemStyle}>
          🏠 Accueil
        </a>

        <a href="/contracts" style={tabItemStyle}>
          ➕ Ajouter
        </a>

        <a href="/alerts" style={tabItemActiveStyle}>
          🔔 Alertes
        </a>

        <a href="/login" style={tabItemStyle}>
          👤 Compte
        </a>
      </div>
    </div>
  )
}

function Section({
  title,
  items,
}: {
  title: string
  items: Contract[]
}) {
  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ marginBottom: 12 }}>{title}</h2>

      {items.length === 0 ? (
        <div
          className="premium-card fade-in"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            color: '#6b7280',
          }}
        >
          Rien ici pour le moment.
        </div>
      ) : (
        items.map((contract) => {
          const days = getDaysUntil(contract.renewal_date)
          const status = getStatus(days)

          return (
            <a
              key={contract.id}
              href={`/compare/${contract.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="premium-card fade-in"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 24,
                  padding: 20,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  marginBottom: 12,
                }}
              >
                <h3 style={{ margin: 0 }}>{contract.category}</h3>
                <p style={{ color: '#6b7280', margin: '8px 0 0' }}>
                  {contract.provider}
                </p>
                <p style={{ margin: '10px 0 0', fontWeight: 700 }}>{status}</p>
                <p style={{ color: '#6b7280', margin: '8px 0 0' }}>
                  {formatDate(contract.renewal_date)}
                </p>
              </div>
            </a>
          )
        })
      )}
    </div>
  )
}

const tabBarStyle: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  bottom: 16,
  transform: 'translateX(-50%)',
  width: 'min(92%, 520px)',
  background: 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  padding: 12,
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  textAlign: 'center',
}

const tabItemStyle: React.CSSProperties = {
  color: '#64748b',
  textDecoration: 'none',
  fontWeight: 600,
}

const tabItemActiveStyle: React.CSSProperties = {
  ...tabItemStyle,
  color: '#111827',
  fontWeight: 700,
}