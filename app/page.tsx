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

  useEffect(() => {
    const fetchContracts = async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('renewal_date', { ascending: true })

      if (error) {
        console.error(error)
      } else {
        setContracts(data || [])
      }
    }

    fetchContracts()
  }, [])

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
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: '#666', marginBottom: 6 }}>Votre copilote d’économies</p>
        <h1 style={{ margin: 0, fontSize: 32 }}>Bonjour 👋</h1>
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
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 14,
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Contrats</p>
          <p style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 700 }}>
            {contracts.length}
          </p>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 14,
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Alertes</p>
          <p style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 700 }}>
            {contracts.filter((c) => getDaysUntil(c.renewal_date) <= 90).length}
          </p>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 14,
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Suivi</p>
          <p style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 700 }}>Actif</p>
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