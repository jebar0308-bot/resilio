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
      <div style={heroStyle}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <h1 style={{ marginTop: 14, marginBottom: 8 }}>C’est fait</h1>
        <p style={{ margin: 0, color: '#666' }}>
          Votre demande est maintenant enregistrée.
        </p>
      </div>

      <div style={cardStyle}>
        <p style={labelStyle}>Contrat</p>
        <h2 style={{ marginTop: 8 }}>{contract}</h2>
        <p style={{ color: '#666', marginTop: 6 }}>
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
  maxWidth: 520,
  margin: '0 auto',
  padding: 20,
  fontFamily: 'Arial, sans-serif',
}

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e5e7eb',
  borderRadius: 20,
  padding: 24,
  textAlign: 'center',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 20,
  padding: 20,
  marginTop: 16,
}

const savingCardStyle: React.CSSProperties = {
  background: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: 20,
  padding: 20,
  marginTop: 16,
  textAlign: 'center',
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#666',
}

const savingValueStyle: React.CSSProperties = {
  margin: '10px 0 0',
  fontSize: 36,
  fontWeight: 700,
  color: '#15803d',
}

const homeButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 20,
  padding: '14px',
  borderRadius: 14,
  border: 'none',
  background: '#111827',
  color: 'white',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
}