'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Click = {
  id: string
  offer_name: string
  current_price: number
  offered_price: number
  created_at: string
}

const ESTIMATED_REVENUE_PER_CLICK = 8

export default function AdminPage() {
  const [clicks, setClicks] = useState<Click[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClicks = async () => {
      const userRes = await supabase.auth.getUser()
      const user = userRes.data.user

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('partner_clicks')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setClicks(data || [])
      }

      setLoading(false)
    }

    fetchClicks()
  }, [])

  const totalClicks = clicks.length

  const estimatedRevenue = useMemo(() => {
    return totalClicks * ESTIMATED_REVENUE_PER_CLICK
  }, [totalClicks])

  const bestOffers = useMemo(() => {
    const counts: Record<string, number> = {}

    clicks.forEach((click) => {
      counts[click.offer_name] = (counts[click.offer_name] || 0) + 1
    })

    return Object.entries(counts)
      .map(([offer, count]) => ({ offer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [clicks])

  return (
    <div style={{ minHeight: '100vh', padding: 20, paddingBottom: 110 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <a href="/" style={{ color: '#6b7280' }}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280' }}>Dashboard</p>
          <h1>Leads générés</h1>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={kpiCardStyle} className="premium-card fade-in">
            <p style={kpiLabelStyle}>Total clics</p>
            <h2 style={kpiValueStyle}>{loading ? '...' : totalClicks}</h2>
          </div>

          <div style={kpiCardStyle} className="premium-card fade-in">
            <p style={kpiLabelStyle}>Revenu estimé</p>
            <h2 style={kpiValueStyle}>{loading ? '...' : `${estimatedRevenue}€`}</h2>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 18,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: 20,
          }}
          className="premium-card fade-in"
        >
          <h3 style={{ marginTop: 0 }}>Top offres</h3>

          {bestOffers.length === 0 ? (
            <p style={{ color: '#6b7280', marginBottom: 0 }}>
              Pas encore assez de données.
            </p>
          ) : (
            bestOffers.map((item) => (
              <div
                key={item.offer}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(15,23,42,0.06)',
                }}
              >
                <span>{item.offer}</span>
                <strong>{item.count} clics</strong>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {clicks.map((c) => {
            const saving = (c.current_price - c.offered_price) * 12

            return (
              <div
                key={c.id}
                className="premium-card fade-in"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 24,
                  padding: 18,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                }}
              >
                <h3 style={{ margin: 0 }}>{c.offer_name}</h3>

                <p style={{ margin: '6px 0', color: '#6b7280' }}>
                  {c.current_price}€ → {c.offered_price}€
                </p>

                <p style={{ margin: 0, fontWeight: 700 }}>
                  +{saving}€/an
                </p>

                <p style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>
                  {new Date(c.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div style={tabBarStyle}>
        <a href="/" style={tabItemStyle}>🏠 Accueil</a>
        <a href="/contracts" style={tabItemStyle}>➕ Ajouter</a>
        <a href="/alerts" style={tabItemStyle}>🔔 Alertes</a>
        <a href="/admin" style={tabItemActiveStyle}>📊 Admin</a>
      </div>
    </div>
  )
}

const kpiCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.75)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  padding: 18,
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
}

const kpiLabelStyle: React.CSSProperties = {
  margin: 0,
  color: '#6b7280',
  fontSize: 13,
}

const kpiValueStyle: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: 34,
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