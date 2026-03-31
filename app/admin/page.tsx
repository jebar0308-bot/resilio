'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Click = {
  id: string
  offer_name: string
  current_price: number
  offered_price: number
  created_at: string
}

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

        {/* KPI */}
        <div
          className="premium-card fade-in"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            marginBottom: 20,
          }}
        >
          <p style={{ color: '#6b7280', margin: 0 }}>
            Total clics
          </p>
          <h2 style={{ fontSize: 42, margin: '10px 0 0' }}>
            {loading ? '...' : totalClicks}
          </h2>
        </div>

        {/* LISTE */}
        <div style={{ display: 'grid', gap: 12 }}>
          {clicks.map((c) => {
            const saving =
              (c.current_price - c.offered_price) * 12

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
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* TAB BAR */}
      <div style={tabBarStyle}>
        <a href="/" style={tabItemStyle}>🏠 Accueil</a>
        <a href="/contracts" style={tabItemStyle}>➕ Ajouter</a>
        <a href="/alerts" style={tabItemStyle}>🔔 Alertes</a>
        <a href="/admin" style={tabItemActiveStyle}>📊 Admin</a>
      </div>
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