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
      <a href="/" style={backLinkStyle}>← Retour</a>

      <div style={{ marginTop: 10 }}>
        <p style={{ color: '#666', marginBottom: 6 }}>Confirmation</p>
        <h1 style={{ margin: 0 }}>Résumé du changement</h1>
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
  maxWidth: 520,
  margin: '0 auto',
  padding: 20,
  fontFamily: 'Arial, sans-serif',
}

const backLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#666',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 20,
  padding: 20,
  marginTop: 20,
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
}

const successCardStyle: React.CSSProperties = {
  background: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: 20,
  padding: 20,
  marginTop: 16,
}

const infoCardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 20,
  padding: 20,
  marginTop: 16,
  color: '#444',
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
  marginTop: 16,
}

const miniCardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 14,
  padding: 14,
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#666',
}

const valueStyle: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 22,
  fontWeight: 700,
}

const confirmButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 20,
  padding: '14px',
  borderRadius: 14,
  border: 'none',
  background: '#16a34a',
  color: 'white',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
}