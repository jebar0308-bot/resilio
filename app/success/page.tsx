'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()

  const contract = searchParams.get('contract')
  const offer = searchParams.get('offer')
  const yearlySaving = searchParams.get('yearlySaving')

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={heroStyle}>
          <div style={{ fontSize: 52 }}>🎉</div>
          <h1 style={{ marginTop: 14, marginBottom: 8 }}>C’est fait</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Votre demande est maintenant enregistrée.
          </p>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Contrat</p>
          <h2 style={{ marginTop: 8 }}>{contract}</h2>
          <p style={{ color: '#6b7280', marginTop: 6 }}>
            Nouvelle offre : <strong>{offer}</strong>
          </p>
        </div>

        <div style={savingCardStyle}>
          <p style={labelStyle}>Économie estimée</p>
          <p style={savingValueStyle}>{yearlySaving}€/an</p>
        </div>

        <div style={cardStyle}>
          <p style={{ margin: 0, color: '#444' }}>
            Prochaine étape : le partenaire vous recontacte ou vous finalisez le changement.
          </p>
        </div>

        <a href="/" style={{ textDecoration: 'none' }}>
          <button style={homeButtonStyle}>
            Retour au dashboard
          </button>
        </a>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
  padding: 20,
  fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif',
}

const heroStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 28,
  padding: 28,
  textAlign: 'center',
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 24,
  padding: 20,
  marginTop: 16,
  boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
}

const savingCardStyle: React.CSSProperties = {
  background: 'rgba(240,253,244,0.88)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid #bbf7d0',
  borderRadius: 28,
  padding: 24,
  marginTop: 16,
  textAlign: 'center',
  boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#6b7280',
}

const savingValueStyle: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: 40,
  fontWeight: 700,
  color: '#15803d',
}

const homeButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 20,
  padding: '15px',
  borderRadius: 16,
  border: 'none',
  background: '#111827',
  color: 'white',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(17,24,39,0.18)',
}