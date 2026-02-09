import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function BarberFlowElite() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('welcome')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) setView('dash')
    }
    checkSession()
  }, [])

  const handleAuth = async () => {
    if (!email || !senha) return alert("Preencha os campos!")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    
    if (error) {
      const { error: signUpErr } = await supabase.auth.signUp({ email, password: senha })
      if (signUpErr) alert("Erro: " + signUpErr.message)
      else alert("Conta criada! Clique em 'Acessar' agora.")
    } else {
      setView('dash')
    }
    setLoading(false)
  }

  // TELA 1: BOAS-VINDAS
  if (view === 'welcome') return (
    <div style={containerBg}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      <div style={contentCenter}>
         <div style={logoIcon}>✂️</div>
         <h1 style={mainTitle}>BARBER FLOW</h1>
         <p style={subTitle}>Gestão de elite para barbearias</p>
         <button onClick={() => setView('login')} style={btnPrimary}>CLIQUE PARA LOGAR</button>
      </div>
    </div>
  )

  // TELA 2: LOGIN ESTILO KIRVANO (SEM FUNDO BRANCO)
  if (view === 'login' && !user) return (
    <div style={containerBg}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      <div style={loginCard}>
        <div style={{marginBottom: '40px'}}>
           <div style={{...logoIcon, fontSize: '30px'}}>✂️</div>
           <h2 style={{...mainTitle, fontSize: '26px'}}>BARBER FLOW</h2>
        </div>

        <div style={inputWrapper}>
          <label style={fieldLabel}>E-mail</label>
          <input 
            style={fieldInput} 
            placeholder="exemplo@email.com" 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>

        <div style={inputWrapper}>
          <label style={fieldLabel}>Senha</label>
          <input 
            style={fieldInput} 
            type="password" 
            placeholder="••••••••" 
            onChange={e => setSenha(e.target.value)} 
          />
        </div>

        <p style={textLinkSmall}>Esqueceu sua senha?</p>

        <div style={dividerLine}><span>✳️</span></div>

        <button onClick={handleAuth} style={loading ? btnDisabled : btnAction} disabled={loading}>
          {loading ? 'AUTENTICANDO...' : 'Acessar minha conta'}
        </button>

        <p style={footerText}>
          Não tem uma conta? <span style={highlightLink}>Cadastrar-se</span>
        </p>
      </div>
    </div>
  )

  // DASHBOARD SIMPLIFICADO (LOGADO)
  return (
    <div style={containerBg}>
      <h2 style={mainTitle}>DASHBOARD ATIVO</h2>
      <button onClick={() => { supabase.auth.signOut(); setView('welcome'); setUser(null); }} style={btnAction}>Sair</button>
    </div>
  )
}

// ESTILOS DE DESIGN DE ELITE (FUNDO ESCURO TOTAL)
const containerBg = { 
  height:'100vh', 
  backgroundColor:'#000000', // Preto absoluto, sem fundo branco
  display:'flex', 
  flexDirection:'column',
