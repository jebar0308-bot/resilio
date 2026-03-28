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
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <p>Chargement...</p>
        </div>
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
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <a href="/" style={backLinkStyle}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280', marginBottom: 6 }}>Comparateur intelligent</p>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              lineHeight: 1.05,
            }}
          >
            Optimiser {contract.category}
          </h1>
        </div>

        <div style={heroCardStyle}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Contrat actuel</p>
          <h2 style={{ marginTop: 10, marginBottom: 8 }}>{contract.provider}</h2>
          <p style={{ margin: 0, color: '#374151' }}>{contract.monthly_price}€/mois</p>
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
                  border: index === 0 ? '2px solid #111827' : '1px solid rgba(255,255,255,0.7)',
                  background: offer.accent,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <span style={badgeStyle}>{offer.badge}</span>
                    <h3 style={{ marginTop: 12, marginBottom: 6 }}>{offer.name}</h3>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      Nouveau prix recommandé
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 30,
                        fontWeight: 700,
                      }}
                    >
                      {offer.price}€
                    </p>
                    <p style={{ margin: 0, color: '#6b7280' }}>/mois</p>
                  </div>
                </div>

                <div style={statsGridStyle}>
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
    </div>
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

const heroCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 28,
  padding: 24,
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
}

const offerCardStyle: React.CSSProperties = {
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 10px 28px rgba(0,0,0,0.06)',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.85)',
  fontSize: 12,
  fontWeight: 700,
}

const statsGridStyle: React.CSSProperties = {
  marginTop: 18,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
}

const miniStatStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 14,
}

const miniLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  color: '#6b7280',
}

const miniValueStyle: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 22,
  fontWeight: 700,
}

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 18,
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