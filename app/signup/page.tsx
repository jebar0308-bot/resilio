'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    // 🔥 FORCER la connexion
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      alert("Compte créé, mais connexion échouée")
    } else {
      alert('Compte créé et connecté !')
    }
  }

  return (
    <div>
      <h1>Créer un compte</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>
        S'inscrire
      </button>
    </div>
  )
}