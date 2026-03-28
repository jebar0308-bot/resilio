'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Connecté !')
      window.location.href = '/'
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

      <h1 style={{ marginTop: 10 }}>Connexion</h1>

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
          <p style={{ marginBottom: 6, fontSize: 14, color: '#666' }}>Email</p>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 6, fontSize: 14, color: '#666' }}>Mot de passe</p>
          <input
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button onClick={handleLogin} style={buttonStyle}>
          Se connecter
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  fontSize: 14,
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: 14,
  border: 'none',
  background: '#111827',
  color: 'white',
  fontWeight: 600,
  fontSize: 16,
  cursor: 'pointer',
}