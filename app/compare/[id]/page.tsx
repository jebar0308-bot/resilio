'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Contract = {
  id: string
  category: string
  provider: string
  monthly_price: number
  renewal_date: string
}

type Offer = {
  name: string
  price: number
  badge: string
  accent: string
}

export default function Compare() {
  const { id } = useParams()
  const [contract, setContract] = useState<Contract | null>(null)

  useEffect(() => {
    const fetchContract = async () => {
      const { data } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single()

      setContract(data)
    }

    fetchContract()
  }, [id])

  if (!contract) {
    return (
      <div style={pageStyle}>
        <p>Chargement...</p>
      </div>
    )
  }

  const offers: Offer[] = [
    {
      name: 'Assuréo',
      price: Math.max(contract.monthly_price - 15, 5),
      badge: '🔥 Meilleur choix',
      accent: '#ecfdf5',
    },
    {
      name: 'ZenCover',
      price: Math.max(contract.monthly_price - 10, 5),
      badge: '⭐ Populaire',
      accent: '#eff6ff',
    },
    {
      name: 'Protect+',
      price: Math.max(contract.monthly_price - 7, 5),
      badge: '⚡ Rapide',
      accent: '#fff7ed',
    },
  ]

  return (
    <div style={pageStyle}>
      <a href="/" style={backLinkStyle}>← Retour</a>

      <div style={{ marginTop: 10 }}>
        <p style={{ color: '#666', marginBottom: 6 }}>Comparateur intelligent</p>
        <h1 style={{ margin: 0 }}>Optimiser {contract.category}</h1>
      </div>

      <div style={heroCardStyle}>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Contrat actuel</p>
        <h2 style={{ marginTop: 10, marginBottom: 8 }}>{contract.provider}</h2>
        <p style={{ margin: 0 }}>{contract.monthly_price}€/mois</p>
      </div>

      <div style={{ display: 'grid', gap: 14, marginTop: 20 }}>
        {offers.map((offer, index) => {
          const monthlySaving = contract.monthly_price - offer.price
          const yearlySaving = monthlySaving * 12

          return (
            <div
              key={offer.name}
              style={{
                ...offerCardStyle,
                border: index === 0 ? '2px solid #111827' : '1px solid #e5e7eb',
                background: offer.accent,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <span style={badgeStyle}>{offer.badge}</span>
                  <h3 style={{ marginTop: 12, marginBottom: 6 }}>{offer.name}</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    Nouveau prix recommandé
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
                    {offer.price}€
                  </p>
                  <p style={{ margin: 0, color: '#666' }}>/mois</p>
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                }}
              >
                <div style={miniStatStyle}>
                  <p style={miniLabelStyle}>Économie / mois</p>
                  <p style={miniValueStyle}>{monthlySaving}€</p>
                </div>

                <div style={miniStatStyle}>
                  <p style={miniLabelStyle}>Économie / an</p>
                  <p style={miniValueStyle}>{yearlySaving}€</p>
                </div>
              </div>

              <a
                href={`/confirm?contract=${encodeURIComponent(contract.category)}&currentPrice=${contract.monthly_price}&offer=${encodeURIComponent(offer.name)}&newPrice=${offer.price}`}
                style={{ textDecoration: 'none' }}
              >
                <button style={primaryButtonStyle}>
                  Choisir cette offre
                </button>
              </a>
            </div>
          )
        })}
      </div>
    </div>
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

const heroCardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid #e5e7eb',
  borderRadius: 20,
  padding: 20,
  marginTop: 20,
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
}

const offerCardStyle: React.CSSProperties = {
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '6px 10px',
  borderRadius: 999,
  background: '#fff',
  fontSize: 12,
  fontWeight: 600,
}

const miniStatStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 14,
  padding: 14,
}

const miniLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#666',
}

const miniValueStyle: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 20,
  fontWeight: 700,
}

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 18,
  padding: '14px',
  borderRadius: 14,
  border: 'none',
  background: '#111827',
  color: 'white',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
}