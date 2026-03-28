'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Contract = {
  id: string
  category: string
  provider: string
  monthly_price: number
  renewal_date: string
  user_id?: string
}

function getDaysUntil(dateString: string) {
  const today = new Date()
  const target = new Date(dateString)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatus(days: number) {
  if (days <= 30) return 'À optimiser'
  if (days <= 90) return 'À surveiller'
  return 'OK'
}

function getStatusStyles(days: number) {
  if (days <= 30) {
    return {
      background: '#fee2e2',
      color: '#991b1b',
    }
  }

  if (days <= 90) {
    return {
      background: '#fef3c7',
      color: '#92400e',
    }
  }

  return {
    background: '#dcfce7',
    color: '#166534',
  }
}

function getEstimatedSaving(monthlyPrice: number) {
  return Math.round(monthlyPrice * 2.5)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const userRes = await supabase.auth.getUser()
      const user = userRes.data.user

      if (!user) {
        setLoggedIn(false)
        setContracts([])
        return
      }

      setLoggedIn(true)

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('renewal_date', { ascending: true })

      if (error) {
        console.error(error)
      } else {
        setContracts(data || [])
      }
    }

    fetchAll()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const totalSaving = contracts.reduce((sum, contract) => {
    return sum + getEstimatedSaving(contract.monthly_price)
  }, 0)

  const nextAction = [...contracts].sort((a, b) => {
    return getDaysUntil(a.renewal_date) - getDaysUntil(b.renewal_date)
  })[0]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
        padding: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            alignItems: 'flex-start',
            marginBottom: 20,
          }}
        >
          <div>
            <p style={{ color: '#6b7280', marginBottom: 6 }}>
              Votre copilote d’économies
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                lineHeight: 1.05,
              }}
            >
              Bonjour 👋
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            {loggedIn ? (
              <button onClick={handleLogout} style={smallButtonStyle}>
                Déconnexion
              </button>
            ) : (
              <a
                href="/login"
                style={{
                  ...smallButtonStyle,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Connexion
              </a>
            )}

            <a
              href="/alerts"
              style={{
                ...smallButtonStyle,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Alertes
            </a>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
            marginBottom: 18,
          }}
        >
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            Économie potentielle
          </p>

          <h2
            style={{
              marginTop: 10,
              marginBottom: 8,
              fontSize: 42,
              lineHeight: 1,
            }}
          >
            {totalSaving}€/an
          </h2>

          <p style={{ color: '#6b7280', margin: 0 }}>
            {nextAction
              ? `Prochaine action : optimiser ${nextAction.category.toLowerCase()}`
              : 'Ajoutez votre premier contrat'}
          </p>

          {nextAction && (
            <a
              href={`/compare/${nextAction.id}`}
              style={{
                display: 'inline-block',
                marginTop: 18,
                background: '#111827',
                color: 'white',
                textDecoration: 'none',
                padding: '13px 18px',
                borderRadius: 16,
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(17,24,39,0.18)',
              }}
            >
              Voir comment
            </a>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={statCardStyle}>
            <p style={statLabelStyle}>Contrats</p>
            <p style={statValueStyle}>{contracts.length}</p>
          </div>

          <div style={statCardStyle}>
            <p style={statLabelStyle}>Alertes</p>
            <p style={statValueStyle}>
              {contracts.filter((c) => getDaysUntil(c.renewal_date) <= 90).length}
            </p>
          </div>

          <div style={statCardStyle}>
            <p style={statLabelStyle}>Suivi</p>
            <p style={statValueStyle}>Actif</p>
          </div>
        </div>

        <a
      href={`/compare/${nextAction.id}`}
  style={{
    display: 'inline-block',
    marginTop: 18,
    background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: '14px 20px',
    borderRadius: 18,
    fontWeight: 700,
    letterSpacing: '-0.01em',
    boxShadow: '0 12px 28px rgba(15,23,42,0.22)',
  }}
        >
          + Ajouter un contrat
        </a>

        <div style={{ display: 'grid', gap: 14 }}>
          {contracts.length === 0 ? (
            <div
              style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.7)',
                borderRadius: 24,
                padding: 20,
                color: '#6b7280',
                boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
              }}
            >
              Aucun contrat pour le moment.
            </div>
          ) : (
            contracts.map((contract) => {
              const days = getDaysUntil(contract.renewal_date)
              const status = getStatus(days)
              const statusStyle = getStatusStyles(days)
              const saving = getEstimatedSaving(contract.monthly_price)

              return (
                <a
                  key={contract.id}
                  href={`/compare/${contract.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.72)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      border: '1px solid rgba(255,255,255,0.7)',
                      borderRadius: 24,
                      padding: 20,
                      boxShadow: '0 10px 28px rgba(0,0,0,0.06)',
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
                        <h3 style={{ margin: 0, fontSize: 19 }}>
                          {contract.category}
                        </h3>
                        <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
                          {contract.provider} · {contract.monthly_price}€/mois
                        </p>
                      </div>

                      <span
  style={{
    background: statusStyle.background,
    color: statusStyle.color,
    borderRadius: 999,
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: '-0.01em',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
  }}
>
  {status}
</span>
                    </div>

                    <div
                      style={{
                        marginTop: 16,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 12,
                      }}
                    >
                      <div>
                        <p style={miniLabelStyle}>Date</p>
                        <p style={miniValueStyle}>{formatDate(contract.renewal_date)}</p>
                      </div>

                      <div>
                        <p style={miniLabelStyle}>Dans</p>
                        <p style={miniValueStyle}>{days} jours</p>
                      </div>

                      <div>
                        <p style={miniLabelStyle}>Économie</p>
                        <p style={miniValueStyle}>{saving}€/an</p>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

const smallButtonStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.7)',
  background: 'rgba(255,255,255,0.78)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  color: '#0f172a',
  borderRadius: 16,
  padding: '11px 14px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 8px 18px rgba(15,23,42,0.06)',
}

const statCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 20,
  padding: 14,
  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
}

const statLabelStyle: React.CSSProperties = {
  margin: 0,
  color: '#6b7280',
  fontSize: 12,
}

const statValueStyle: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 24,
  fontWeight: 700,
}

const miniLabelStyle: React.CSSProperties = {
  margin: 0,
  color: '#6b7280',
  fontSize: 12,
}

const miniValueStyle: React.CSSProperties = {
  margin: '6px 0 0',
  fontWeight: 700,
}