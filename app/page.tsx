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

        const { data } = await supabase
          .from('contracts')
          .select('*')
          .eq('user_id', user.id)
          .order('renewal_date', { ascending: true })

        setContracts(data || [])
      } catch (e) {
        console.error(e)
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
        getDaysUntil(a.renewal_date) -
        getDaysUntil(b.renewal_date)
    )[0]
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
        fontFamily: '-apple-system, BlinkMacSystemFont, Arial',
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ color: '#6b7280' }}>Votre copilote</p>
            <h1 style={{ margin: 0 }}>Bonjour 👋</h1>
          </div>

          {loggedIn && (
            <button onClick={handleLogout} style={smallButton}>
              Déconnexion
            </button>
          )}
        </div>

        {/* HERO CARD */}
        <div
          style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            marginBottom: 20,
          }}
        >
          {/* GLOW */}
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
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#6b7280' }}>Économie potentielle</p>

            <h2 style={{ fontSize: 42 }}>
              {loading ? '...' : `${totalSaving}€/an`}
            </h2>

            {nextAction && (
              <a
                href={`/compare/${nextAction.id}`}
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  padding: '14px 20px',
                  borderRadius: 18,
                  background:
                    'linear-gradient(135deg, #6366f1, #10b981)',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 700,
                  boxShadow:
                    '0 12px 30px rgba(99,102,241,0.35)',
                }}
              >
                Optimiser maintenant
              </a>
            )}
          </div>
        </div>

        {/* CONTRACTS */}
        <div style={{ display: 'grid', gap: 14 }}>
          {contracts.map((c) => {
            const days = getDaysUntil(c.renewal_date)
            const status = getStatus(days)
            const styles = getStatusStyles(days)

            return (
              <a key={c.id} href={`/compare/${c.id}`}>
                <div
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.75)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  }}
                >
                  <h3>{c.category}</h3>
                  <p>{c.provider}</p>

                  <span
                    style={{
                      background: styles.background,
                      color: styles.color,
                      padding: '6px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                    }}
                  >
                    {status}
                  </span>

                  <p>{formatDate(c.renewal_date)}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const smallButton: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 14,
  border: 'none',
  background: '#111827',
  color: 'white',
}