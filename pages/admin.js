import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function BarberFlowKirvano() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('welcome') // welcome, login, dash
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
      if (signUpErr) alert(signUpErr.message)
      else alert("Conta criada! Clique em 'Acessar' novamente.")
    } else {
      setView('dash')
    }
    setLoading(false)
  }

  // 1. TELA DE BOAS-VINDAS (START)
  if (view === 'welcome') return (
    <div style={fullBg}>
      <div style={logoContainer}>
         <div style={logoIcon}>✂️</div>
         <h1 style={logoText}>BARBERFLOW</h1>
      </div>
      <p style={subTitle}>Gestão de elite para barbearias</p>
      <button onClick={() => setView('login')} style={btnStart}>CLIQUE PARA LOGAR</button>
    </div>
  )

  // 2. TELA DE LOGIN (ESTILO KIRVANO)
  if (view === 'login' && !user) return (
    <div style={fullBg}>
      <div style={loginCard}>
        <div style={{marginBottom: '30px'}}>
           <div style={{...logoIcon, fontSize: '30px'}}>✂️</div>
           <h2 style={{...logoText, fontSize: '24px'}}>BARBERFLOW</h2>
        </div>

        <div style={inputGroup}>
          <label style={kLabel}>E-mail</label>
          <input style={kInput} placeholder="seu@email.com" onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={inputGroup}>
          <label style={kLabel}>Senha</label>
          <input style={kInput} type="password" placeholder="••••••••" onChange={e => setSenha(e.target.value)} />
        </div>

        <p style={forgotText}>Esqueceu sua senha?</p>

        <div style={divider}><span>✳️</span></div>

        <button onClick={handleAuth} style={loading ? btnDisabled : kBtnPrimary} disabled={loading}>
          {loading ? 'CARREGANDO...' : 'Acessar minha conta'}
        </button>

        <p style={footerText}>Não tem uma conta? <span style={linkText} onClick={() => alert('Basta digitar e-mail e senha novos e clicar em Acessar!')}>Cadastrar-se</span></p>
      </div>
    </div>
  )

  // 3. DASHBOARD (SÓ APARECE SE LOGADO)
  return (
    <div style={{backgroundColor:'#000', minHeight:'100vh', color:'#fff', padding:'20px'}}>
      <h2>Bem-vindo ao BarberFlow</h2>
      <button onClick={() => { supabase.auth.signOut(); setView('welcome'); setUser(null); }} style={kBtnPrimary}>Sair</button>
    </div>
  )
}

// ESTILOS DE ALTA FIDELIDADE
const fullBg = { height:'100vh', backgroundColor:'#0a0a0a', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'20px', fontFamily:'sans-serif' }
const logoContainer = { marginBottom: '40px', textAlign: 'center' }
const logoIcon = { fontSize: '40px', marginBottom: '10px' }
const logoText = { color:'#fff', fontSize:'32px', fontWeight:'800', letterSpacing:'-1px', margin: 0 }
const subTitle = { color:'#555', marginBottom:'40px', fontSize:'16px' }
const btnStart = { width:'100%', maxWidth:'320px', padding:'20px', backgroundColor:'#38bdf8', color:'#000', border:'none', borderRadius:'15px', fontWeight:'bold', fontSize:'15px', cursor:'pointer' }

const loginCard = { width: '100%', maxWidth: '380px', textAlign: 'center' }
const inputGroup = { textAlign: 'left', marginBottom: '15px' }
const kLabel = { color: '#ccc', fontSize: '13px', marginLeft: '5px', marginBottom: '5px', display: 'block' }
const kInput = { width: '100%', padding: '16px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }
const forgotText = { color: '#38bdf8', fontSize: '13px', textAlign: 'right', marginTop: '10px', cursor: 'pointer' }
const divider = { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px 0', color: '#333', fontSize: '12px', borderTop: '1px solid #222' }
const kBtnPrimary = { width: '100%', padding: '18px', backgroundColor: '#0066ff', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }
const btnDisabled = { ...kBtnPrimary, backgroundColor: '#1e293b', color: '#666' }
const footerText = { marginTop: '25px', color: '#888', fontSize: '14px' }
const linkText = { color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }
