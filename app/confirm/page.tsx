'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ConfirmContent() {
  const searchParams = useSearchParams()

  const contract = searchParams.get('contract')
  const currentPrice = searchParams.get('currentPrice')
  const offer = searchParams.get('offer')
  const newPrice = searchParams.get('newPrice')

  const monthlySaving =
    Number(currentPrice || 0) - Number(newPrice || 0)

  const yearlySaving = monthlySaving * 12

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <a href="/" style={backLinkStyle}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280', marginBottom: 6 }}>Confirmation</p>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              lineHeight: 1.05,
            }}
          >
            Résumé du changement
          </h1>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Contrat</p>
          <h2 style={{ marginTop: 8 }}>{contract}</h2>

          <div style={gridStyle}>
            <div style={miniCardStyle}>
              <p style={labelStyle}>Actuel</p>
              <p style={valueStyle}>{currentPrice}€/mois</p>
            </div>

            <div style={miniCardStyle}>
              <p style={labelStyle}>Nouveau</p>
              <p style={valueStyle}>{newPrice}€/mois</p>
            </div>
          </div>
        </div>

        <div style={successCardStyle}>
          <p style={labelStyle}>Offre choisie</p>
          <h3 style={{ marginTop: 8 }}>{offer}</h3>

          <div style={gridStyle}>
            <div style={miniCardStyle}>
              <p style={labelStyle}>Économie / mois</p>
              <p style={valueStyle}>{monthlySaving}€</p>
            </div>

            <div style={miniCardStyle}>
              <p style={labelStyle}>Économie / an</p>
              <p style={valueStyle}>{yearlySaving}€</p>
            </div>
          </div>
        </div>

        <div style={infoCardStyle}>
          <p style={{ margin: 0 }}>✔ Aucun changement sans votre accord</p>
          <p style={{ marginTop: 10 }}>✔ Partenaire vérifié</p>
          <p style={{ marginTop: 10 }}>✔ Résiliation guidée ensuite</p>
        </div>

        <a
          href={`/success?contract=${encodeURIComponent(contract || '')}&offer=${encodeURIComponent(offer || '')}&yearlySaving=${yearlySaving}`}
          style={{ textDecoration: 'none' }}
        >
          <button style={confirmButtonStyle}>
            Confirmer le changement
          </button>
        </a>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Chargement...</div>}>
      <ConfirmContent />
    </Suspense>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
  padding: 20,
  fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif',
}

const backLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#6b7280',
  display: 'inline-block',
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 28,
  padding: 24,
  marginTop: 20,
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
}

const successCardStyle: React.CSSProperties = {
  background: 'rgba(240,253,244,0.88)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid #bbf7d0',
  borderRadius: 28,
  padding: 24,
  marginTop: 16,
  boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
}

const infoCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 24,
  padding: 20,
  marginTop: 16,
  color: '#444',
  boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
  marginTop: 16,
}

const miniCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 14,
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#6b7280',
}

const valueStyle: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 22,
  fontWeight: 700,
}

const confirmButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 20,
  padding: '15px',
  borderRadius: 16,
  border: 'none',
  background: '#16a34a',
  color: 'white',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(22,163,74,0.18)',
}