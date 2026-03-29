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
        padding: 20,
        paddingBottom: 110,
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        
        <a href="/" style={{ color: '#6b7280' }}>
          ← Retour
        </a>

        <div style={{ marginTop: 12, marginBottom: 20 }}>
          <p style={{ color: '#6b7280' }}>Nouveau contrat</p>
          <h1>Ajouter un contrat</h1>
        </div>

        <div
          className="premium-card fade-in"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: 28,
            padding: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          }}
        >
          <input
            placeholder="Type (Assurance auto)"
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Fournisseur"
            onChange={(e) => setProvider(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Prix mensuel"
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={handleAdd}
            style={buttonStyle}
            className="premium-button"
          >
            Ajouter le contrat
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={tabBarStyle}>
        <a href="/" style={tabItemStyle}>
          🏠 Accueil
        </a>

        <a href="/contracts" style={tabItemActiveStyle}>
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 14,
  borderRadius: 16,
  border: '1px solid #e5e7eb',
  marginBottom: 12,
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: 16,
  borderRadius: 18,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1, #10b981)',
  color: 'white',
  fontWeight: 700,
  marginTop: 10,
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

const tabItemActiveStyle: React.CSSProperties = {
  ...tabItemStyle,
  color: '#111827',
  fontWeight: 700,
}