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
  tone: string
}

export default function ComparePage() {
  const { id } = useParams()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loadingOffer, setLoadingOffer] = useState<string | null>(null)

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

  const handleChooseOffer = async (offer: Offer) => {
    if (!contract) return

    const userRes = await supabase.auth.getUser()
    const user = userRes.data.user

    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoadingOffer(offer.name)

    const { error } = await supabase.from('partner_clicks').insert({
      user_id: user.id,
      contract_id: contract.id,
      offer_name: offer.name,
      current_price: contract.monthly_price,
      offered_price: offer.price,
    })

    if (error) {
      alert(error.message)
      setLoadingOffer(null)
      return
    }

    window.location.href = `/confirm?contract=${encodeURIComponent(
      contract.category
    )}&currentPrice=${contract.monthly_price}&offer=${encodeURIComponent(
      offer.name
    )}&newPrice=${offer.price}`
  }

  if (!contract) {
    return (
      <div style={{ minHeight: '100vh', padding: 20, paddingBottom: 110 }}>
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
      tone: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(16,185,129,0.14))',
    },
    {
      name: 'ZenCover',
      price: Math.max(contract.monthly_price - 10, 5),
      badge: '⭐ Populaire',
      tone: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(14,165,233,0.12))',
    },
    {
      name: 'Protect+',
      price: Math.max(contract.monthly_price - 7, 5),
      badge: '⚡ Rapide',
      tone: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.10))',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 20,
        paddingBottom: 110,
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <a href="/" style={{ color: '#6b7280' }}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280' }}>Comparateur intelligent</p>
          <h1>Optimiser {contract.category}</h1>
        </div>

        <div
          className="premium-card fade-in"
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            marginBottom: 18,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -20,
              width: 140,
              height: 140,
              background:
                'radial-gradient(circle, rgba(16,185,129,0.20), transparent 70%)',
              filter: 'blur(34px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#6b7280', margin: 0 }}>Contrat actuel</p>
            <h2 style={{ margin: '10px 0 8px' }}>{contract.provider}</h2>
            <p style={{ margin: 0, color: '#374151' }}>
              {contract.monthly_price}€/mois
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          {offers.map((offer) => {
            const monthlySaving = contract.monthly_price - offer.price
            const yearlySaving = monthlySaving * 12

            return (
              <div
                key={offer.name}
                className="premium-card fade-in"
                style={{
                  background: offer.tone,
                  backdropFilter: 'blur(20px)',
                  borderRadius: 24,
                  padding: 20,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  border:
                    offer.badge === '🔥 Meilleur choix'
                      ? '1.5px solid rgba(99,102,241,0.35)'
                      : '1px solid rgba(255,255,255,0.7)',
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
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.82)',
                        padding: '7px 11px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {offer.badge}
                    </span>
                    <h3 style={{ margin: '12px 0 6px' }}>{offer.name}</h3>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      Nouveau prix recommandé
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 30, fontWeight: 700 }}>
                      {offer.price}€
                    </p>
                    <p style={{ margin: 0, color: '#6b7280' }}>/mois</p>
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
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.82)',
                      borderRadius: 18,
                      padding: 14,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                      Économie / mois
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 700 }}>
                      {monthlySaving}€
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.82)',
                      borderRadius: 18,
                      padding: 14,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                      Économie / an
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 700 }}>
                      {yearlySaving}€
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleChooseOffer(offer)}
                  disabled={loadingOffer === offer.name}
                  className="premium-button"
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 18,
                    padding: '16px',
                    borderRadius: 18,
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 12px 30px rgba(99,102,241,0.30)',
                    cursor: 'pointer',
                    opacity: loadingOffer === offer.name ? 0.7 : 1,
                  }}
                >
                  {loadingOffer === offer.name ? 'Enregistrement...' : 'Choisir cette offre'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div style={tabBarStyle}>
        <a href="/" style={tabItemStyle}>
          🏠 Accueil
        </a>

        <a href="/contracts" style={tabItemStyle}>
          ➕ Ajouter
        </a>

        <a href="/alerts" style={tabItemStyle}>
          🔔 Alertes
        </a>

        <a href="/login" style={tabItemStyle}>
          👤 Compte
        </a>
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