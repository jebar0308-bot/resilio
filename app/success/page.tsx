'use client'

export default function SuccessPage() {
  return (
    <div style={{ minHeight: '100vh', padding: 20, paddingBottom: 110 }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ marginTop: 60 }}>

          <div
            style={{
              width: 100,
              height: 100,
              margin: '0 auto 20px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #10b981, #22c55e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              color: 'white',
              boxShadow: '0 20px 50px rgba(16,185,129,0.4)',
            }}
          >
            ✓
          </div>

          <h1>Changement lancé</h1>

          <p style={{ color: '#6b7280', marginTop: 10 }}>
            Nous nous occupons de tout.
            <br />
            Vous allez économiser sans effort.
          </p>

          <a
            href="/"
            className="premium-button"
            style={{
              display: 'inline-block',
              marginTop: 30,
              padding: '16px 24px',
              borderRadius: 18,
              background: '#111827',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Retour au dashboard
          </a>
        </div>
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