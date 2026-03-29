'use client'

import { useSearchParams } from 'next/navigation'

export default function ConfirmPage() {
  const params = useSearchParams()

  const contract = params.get('contract')
  const currentPrice = Number(params.get('currentPrice'))
  const offer = params.get('offer')
  const newPrice = Number(params.get('newPrice'))

  const monthlySaving = currentPrice - newPrice
  const yearlySaving = monthlySaving * 12

  return (
    <div style={{ minHeight: '100vh', padding: 20, paddingBottom: 110 }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <a href="/" style={{ color: '#6b7280' }}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280' }}>Confirmation</p>
          <h1>Valider le changement</h1>
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
          <h2>{contract}</h2>

          <p style={{ color: '#6b7280' }}>
            {currentPrice}€ → {newPrice}€/mois
          </p>

          <div style={{ marginTop: 18 }}>
            <p style={{ margin: 0 }}>Économie mensuelle</p>
            <h3 style={{ margin: '6px 0' }}>{monthlySaving}€</h3>

            <p style={{ margin: 0 }}>Économie annuelle</p>
            <h3 style={{ margin: '6px 0' }}>{yearlySaving}€</h3>
          </div>
        </div>

        <a
          href="/success"
          className="premium-button"
          style={{
            display: 'block',
            padding: 18,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #10b981, #22c55e)',
            color: 'white',
            textAlign: 'center',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 12px 30px rgba(16,185,129,0.4)',
          }}
        >
          Confirmer le changement
        </a>
      </div>

      <div style={tabBarStyle}>
        <a href="/" style={tabItemStyle}>🏠 Accueil</a>
        <a href="/contracts" style={tabItemStyle}>➕ Ajouter</a>
        <a href="/alerts" style={tabItemStyle}>🔔 Alertes</a>
        <a href="/login" style={tabItemStyle}>👤 Compte</a>
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