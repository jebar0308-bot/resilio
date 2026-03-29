'use client'

import { useEffect, useMemo, useState } from 'react'
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
    return { background: '#fee2e2', color: '#991b1b' }
  }
  if (days <= 90) {
    return { background: '#fef3c7', color: '#92400e' }
  }
  return { background: '#dcfce7', color: '#166534' }
}

function getEstimatedSaving(price: number) {
  return Math.round(price * 2.5)
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await supabase.auth.getUser()
        const user = userRes.data.user

        if (!user) {
          setLoggedIn(false)
          setContracts([])
          setLoading(false)
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
          setContracts([])
        } else {
          setContracts((data || []) as Contract[])
        }
      } catch (e) {
        console.error(e)
        setContracts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalSaving = useMemo(() => {
    return contracts.reduce(
      (sum, c) => sum + getEstimatedSaving(c.monthly_price),
      0
    )
  }, [contracts])

  const nextAction = useMemo(() => {
    if (!contracts.length) return null
    return [...contracts].sort(
      (a, b) =>
        getDaysUntil(a.renewal_date) - getDaysUntil(b.renewal_date)
    )[0]
  }, [contracts])

  const alertsCount = useMemo(() => {
    return contracts.filter((c) => getDaysUntil(c.renewal_date) <= 90).length
  }, [contracts])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 20,
        paddingBottom: 110,
        fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
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
              <button
                onClick={handleLogout}
                style={smallButtonStyle}
                className="premium-button"
              >
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
                className="premium-button"
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
              className="premium-button"
            >
              Alertes
            </a>
          </div>
        </div>

        <div
          className="premium-card fade-in"
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 20px 60px rgba(15,23,42,0.12)',
            marginBottom: 18,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 160,
              height: 160,
              background:
                'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
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
              {loading ? '...' : `${totalSaving}€/an`}
            </h2>

            <p style={{ color: '#6b7280', margin: 0 }}>
              {nextAction
                ? `Prochaine action : optimiser ${nextAction.category.toLowerCase()}`
                : 'Ajoutez votre premier contrat'}
            </p>

            {nextAction?.id ? (
              <a
                href={`/compare/${nextAction.id}`}
                className="premium-button"
                style={{
                  display: 'inline-block',
                  marginTop: 18,
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '14px 20px',
                  borderRadius: 18,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  boxShadow: '0 12px 30px rgba(99,102,241,0.35)',
                }}
              >
                Optimiser maintenant
              </a>
            ) : null}
          </div>
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
            <p style={statValueStyle}>{alertsCount}</p>
          </div>

          <div style={statCardStyle}>
            <p style={statLabelStyle}>Suivi</p>
            <p style={statValueStyle}>Actif</p>
          </div>
        </div>

        <a
          href="/contracts"
          style={{
            display: 'inline-block',
            marginBottom: 20,
            textDecoration: 'none',
            color: '#111827',
            fontWeight: 600,
          }}
          className="premium-button"
        >
          + Ajouter un contrat
        </a>

        <div style={{ display: 'grid', gap: 14 }}>
          {contracts.length === 0 ? (
            <div
              className="premium-card fade-in"
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
              if (!contract?.id) return null

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
                    className="premium-card fade-in"
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
                          boxShadow:
                            'inset 0 1px 0 rgba(255,255,255,0.45)',
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
                        <p style={miniValueStyle}>
                          {formatDate(contract.renewal_date)}
                        </p>
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

      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          width: 'min(92%, 520px)',
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.7)',
          borderRadius: 24,
          padding: '10px 12px',
          boxShadow: '0 18px 40px rgba(15,23,42,0.14)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          zIndex: 100,
        }}
      >
        <a href="/" style={tabItemActiveStyle}>
          <span style={tabIconStyle}>🏠</span>
          <span>Accueil</span>
        </a>

        <a href="/contracts" style={tabItemStyle}>
          <span style={tabIconStyle}>➕</span>
          <span>Ajouter</span>
        </a>

        <a href="/alerts" style={tabItemStyle}>
          <span style={tabIconStyle}>🔔</span>
          <span>Alertes</span>
        </a>

        <a href="/login" style={tabItemStyle}>
          <span style={tabIconStyle}>👤</span>
          <span>Compte</span>
        </a>
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

const tabItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  padding: '10px 6px',
  borderRadius: 16,
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
  textDecoration: 'none',
}

const tabItemActiveStyle: React.CSSProperties = {
  ...tabItemStyle,
  background: 'rgba(255,255,255,0.9)',
  color: '#111827',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 18px rgba(15,23,42,0.08)',
}

const tabIconStyle: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1,
}