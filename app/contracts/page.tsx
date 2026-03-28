'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Contracts() {
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState('')

  const handleAdd = async () => {
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
      alert("Vous n'êtes pas connecté")
      return
    }

    const { error } = await supabase.from('contracts').insert({
      user_id: user.id,
      category: name,
      provider,
      monthly_price: Number(price),
      renewal_date: date,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Contrat ajouté !')
      window.location.href = '/'
    }
  }

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
        <a href="/" style={backLinkStyle}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280', marginBottom: 6 }}>Nouveau contrat</p>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              lineHeight: 1.05,
            }}
          >
            Ajouter un contrat
          </h1>
        </div>

        <div style={formCardStyle}>
          <div style={{ marginBottom: 16 }}>
            <p style={labelStyle}>Type de contrat</p>
            <input
              placeholder="Assurance auto"
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={labelStyle}>Fournisseur</p>
            <input
              placeholder="AXA, Orange..."
              onChange={(e) => setProvider(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={labelStyle}>Prix mensuel</p>
            <input
              placeholder="50"
              onChange={(e) => setPrice(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={labelStyle}>Date anniversaire</p>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={hintCardStyle}>
            <p style={{ margin: 0, fontWeight: 600 }}>Surveillance automatique</p>
            <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
              L’app vous préviendra au bon moment pour comparer et économiser.
            </p>
          </div>

          <button onClick={handleAdd} style={primaryButtonStyle}>
            Ajouter le contrat
          </button>
        </div>
      </div>
    </div>
  )
}

const backLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#6b7280',
  display: 'inline-block',
}

const formCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 28,
  padding: 24,
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
}

const labelStyle: React.CSSProperties = {
  marginBottom: 8,
  fontSize: 14,
  color: '#6b7280',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px 16px',
  borderRadius: 18,
  border: '1px solid rgba(15,23,42,0.08)',
  background: 'rgba(255,255,255,0.88)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 6px 16px rgba(15,23,42,0.04)',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  color: '#0f172a',
}

const hintCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: 22,
  padding: 18,
  marginTop: 10,
  marginBottom: 18,
  boxShadow: '0 10px 24px rgba(15,23,42,0.05)',
}

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: 18,
  border: '1px solid rgba(15,23,42,0.06)',
  background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
  color: 'white',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 12px 28px rgba(15,23,42,0.22)',
  letterSpacing: '-0.01em',
}