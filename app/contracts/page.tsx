'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Contracts() {
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState('')

  const handleAdd = async () => {
    const user = await supabase.auth.getUser()
    const userId = user.data.user?.id

    const { error } = await supabase.from('contracts').insert({
      user_id: userId,
      category: name,
      provider,
      monthly_price: Number(price),
      renewal_date: date,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Contrat ajouté !')
    }
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <a href="/" style={{ textDecoration: 'none', color: '#666' }}>
        ← Retour
      </a>

      <h1 style={{ marginTop: 10 }}>Ajouter un contrat</h1>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 20,
          padding: 20,
          marginTop: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 6, fontSize: 14, color: '#666' }}>
            Type de contrat
          </p>
          <input
            placeholder="Assurance auto"
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 6, fontSize: 14, color: '#666' }}>
            Fournisseur
          </p>
          <input
            placeholder="AXA, Orange..."
            onChange={(e) => setProvider(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 6, fontSize: 14, color: '#666' }}>
            Prix mensuel
          </p>
          <input
            placeholder="50"
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 6, fontSize: 14, color: '#666' }}>
            Date anniversaire
          </p>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: 'none',
            background: '#111827',
            color: 'white',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 10,
          }}
        >
          Ajouter le contrat
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  fontSize: 14,
}