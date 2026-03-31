'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = async () => {
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        alert(error.message)
      } else {
        alert('Compte créé ! Vous pouvez vous connecter.')
        setMode('login')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        alert(error.message)
      } else {
        window.location.href = '/'
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        
        <a href="/" style={{ color: '#6b7280' }}>
          ← Retour
        </a>

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h1>
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
        </div>

        {/* SWITCH */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setMode('login')}
            style={mode === 'login' ? activeTab : tab}
          >
            Connexion
          </button>

          <button
            onClick={() => setMode('signup')}
            style={mode === 'signup' ? activeTab : tab}
          >
            Inscription
          </button>
        </div>

        {/* FORM */}
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
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button
            onClick={handleAuth}
            className="premium-button"
            style={button}
          >
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </div>
      </div>
    </div>
  )
}

const input: React.CSSProperties = {
  width: '100%',
  padding: 14,
  borderRadius: 14,
  border: '1px solid #e5e7eb',
  marginBottom: 12,
}

const button: React.CSSProperties = {
  width: '100%',
  padding: 16,
  borderRadius: 18,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1, #10b981)',
  color: 'white',
  fontWeight: 700,
}

const tab: React.CSSProperties = {
  flex: 1,
  padding: 10,
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  background: 'white',
}

const activeTab: React.CSSProperties = {
  ...tab,
  background: '#111827',
  color: 'white',
}