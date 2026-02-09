import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function BarberFlowElite() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('welcome')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState([])

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        setView('dash')
        carregarTudo()
      }
    }
    checkSession()
  }, [])

  async function carregarTudo() {
    try {
      const { data } = await supabase.from('agendamentos').select('*')
      if (data) setDados(data)
    } catch (e) {
      console.log("Ainda não existem agendamentos.")
    }
  }

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
      carregarTudo()
    }
    setLoading(false)
  }

  const totalVendas = dados.length > 0 ? dados.filter(i => i.status === 'concluido').reduce((acc, curr) => acc + Number(curr.valor), 0) : 0

  // 1. TELA DE BOAS VINDAS
  if (view === 'welcome') return (
    <div style={containerBg}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      <div style={{textAlign: 'center'}}>
         <div style={{fontSize: '42px'}}>✂️</div>
         <h1 style={mainTitle}>BARBER FLOW</h1>
         <p style={subTitle}>Gestão de elite para barbearias</p>
         <button onClick={() => setView('login')} style={btnStart}>CLIQUE PARA LOGAR</button>
      </div>
    </div>
  )

  // 2. TELA DE LOGIN
  if (view === 'login' && !user) return (
    <div style={containerBg}>
      <div style={{width: '100%', maxWidth: '360px', textAlign: 'center'}}>
        <div style={{marginBottom: '40px'}}>
           <div style={{fontSize: '30px'}}>✂️</div>
           <h2 style={{...mainTitle, fontSize: '26px'}}>BARBER FLOW</h2>
        </div>
        <div style={inputGroup}>
          <label style={fLabel}>E-mail</label>
          <input style={fInput} placeholder="seu@email.com" onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={inputGroup}>
          <label style={fLabel}>Senha</label>
          <input style={fInput} type="password" placeholder="••••••••" onChange={e => setSenha(e.target.value)} />
        </div>
        <p style={{color: '#38bdf8', fontSize: '13px', textAlign: 'right', cursor: 'pointer'}} onClick={() => alert("Função de recuperação será ativada na versão PRO!")}>Esqueceu sua senha?</p>
        <button onClick={handleAuth} style={loading ? btnDisabled : btnAction} disabled={loading}>
          {loading ? 'CARREGANDO...' : 'Acessar minha conta'}
        </button>
      </div>
    </div>
  )

  // 3. DASHBOARD (CORREÇÃO DA TELA BRANCA)
  return (
    <div style={containerBg}>
      <div style={{width: '100%', maxWidth: '400px'}}>
        <h2 style={{...mainTitle, fontSize: '20px', marginBottom: '20px'}}>Dashboard</h2>
        
        <div style={kCard}>
           <p style={{fontSize: '12px', color: '#666'}}>Total em vendas hoje</p>
           <h3 style={{fontSize: '32px', color: '#38bdf8', margin: '10px 0'}}>R$ {totalVendas.toFixed(2)}</h3>
        </div>

        <button onClick={async () => {
           await supabase.from('agendamentos').insert([{cliente: 'Venda Teste', valor: 50, status: 'concluido'}])
           carregarTudo()
        }} style={btnStart}>+ LANÇAR VENDA R$ 50</button>

        <button onClick={() => { supabase.auth.signOut(); setView('welcome'); setUser(null); }} style={{...btnAction, backgroundColor: 'transparent', color: '#444', marginTop: '20px'}}>Sair</button>
      </div>
    </div>
  )
}

// ESTILOS
const containerBg = { height:'100vh', backgroundColor:'#000', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'20px', fontFamily:'"Inter", sans-serif', color: '#fff' }
const mainTitle = { fontWeight:'800', letterSpacing:'-1.5px', margin: 0 }
const subTitle = { color:'#555', marginBottom:'40px' }
const btnStart = { width:'100%', padding:'18px', backgroundColor:'#38bdf8', border:'none', borderRadius:'14px', fontWeight:'700', cursor:'pointer' }
const inputGroup = { textAlign: 'left', marginBottom: '15px', width: '100%' }
const fLabel = { color: '#666', fontSize: '12px', marginBottom: '5px', display: 'block' }
const fInput = { width: '100%', padding: '15px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', color: '#fff', boxSizing: 'border-box' }
const btnAction = { width: '100%', padding: '18px', backgroundColor: '#0066FF', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }
const btnDisabled = { ...btnAction, backgroundColor: '#222', color: '#444' }
const kCard = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', marginBottom: '20px' }
