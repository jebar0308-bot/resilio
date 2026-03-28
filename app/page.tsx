'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Contract = {
  id: string
  category: string
  provider: string
  monthly_price: number
  renewal_date: string
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

function getStatusColor(days: number) {
  if (days <= 30) return '#ffe4e6'
  if (days <= 90) return '#fef3c7'
  return '#dcfce7'
}

function getEstimatedSaving(monthlyPrice: number) {
  return Math.round(monthlyPrice * 2.5)
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
    alert('Déconnecté')
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
        padding: 20,
        maxWidth: 520,
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p style={{ color: '#666', marginBottom: 6 }}>Votre copilote d’économies</p>
          <h1 style={{ margin: 0, fontSize: 32 }}>Bonjour 👋</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {loggedIn ? (
            <button onClick={handleLogout} style={smallButtonStyle}>
              Déconnexion
            </button>
          ) : (
            <a href="/login" style={{ ...smallButtonStyle, textDecoration: 'none', display: 'inline-block' }}>
              Connexion
            </a>
          )}

          <a href="/alerts" style={{ ...smallButtonStyle, textDecoration: 'none', display: 'inline-block' }}>
            Alertes
          </a>
        </div>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e5e7eb',
          borderRadius: 20,
          padding: 22,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          marginBottom: 18,
        }}
      >
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Économie potentielle</p>
        <h2 style={{ marginTop: 10, marginBottom: 8, fontSize: 36 }}>
          {totalSaving}€/an
        </h2>
        <p style={{ color: '#666', margin: 0 }}>
          {nextAction
            ? `Prochaine action : optimiser ${nextAction.category.toLowerCase()}`
            : 'Ajoutez votre premier contrat'}
        </p>

        {nextAction && (
          <a
            href={`/compare/${nextAction.id}`}
            style={{
              display: 'inline-block',
              marginTop: 16,
              background: '#111827',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 16px',
              borderRadius: 12,
              fontWeight: 600,
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
        href="/contracts"
        style={{
          display: 'inline-block',
          marginBottom: 20,
          textDecoration: 'none',
          color: '#111827',
          fontWeight: 600,
        }}
      >
        + Ajouter un contrat
      </a>

      <div style={{ display: 'grid', gap: 12 }}>
        {contracts.length === 0 ? (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 20,
              color: '#666',
            }}
          >
            Aucun contrat pour le moment.
          </div>
        ) : (
          contracts.map((contract) => {
            const days = getDaysUntil(contract.renewal_date)
            const status = getStatus(days)
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
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 18,
                    padding: 18,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>{contract.category}</h3>
                      <p style={{ margin: '8px 0 0', color: '#666' }}>
                        {contract.provider} · {contract.monthly_price}€/mois
                      </p>
                    </div>

                    <span
                      style={{
                        background: getStatusColor(days),
                        borderRadius: 999,
                        padding: '6px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 10,
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Date</p>
                      <p style={{ margin: '6px 0 0', fontWeight: 600 }}>
                        {contract.renewal_date}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Dans</p>
                      <p style={{ margin: '6px 0 0', fontWeight: 600 }}>{days} jours</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Économie</p>
                      <p style={{ margin: '6px 0 0', fontWeight: 600 }}>{saving}€/an</p>
                    </div>
                  </div>
                </div>
              </a>
            )
          })
        )}
      </div>
    </div>
  )
}

const smallButtonStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#111827',
  borderRadius: 12,
  padding: '10px 12px',
  fontWeight: 600,
  cursor: 'pointer',
}

const statCardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 16,
  padding: 14,
}

const statLabelStyle: React.CSSProperties = {
  margin: 0,
  color: '#666',
  fontSize: 12,
}

const statValueStyle: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 22,
  fontWeight: 700,
}