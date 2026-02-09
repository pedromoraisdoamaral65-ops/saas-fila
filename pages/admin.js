import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function SunizeProfessional() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false) // ESTADO DE CARREGAMENTO
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [dados, setDados] = useState([])
  const [step, setStep] = useState('dash')

  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) carregarDados()
  }, [user])

  async function carregarDados() {
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (data) setDados(data)
  }

  const handleLogin = async () => {
    if (!email || !senha) return alert("Preencha os campos")
    setLoading(true) // ATIVA O LOADING

    // Tenta Logar
    const { data, error: loginErr } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (loginErr) {
      // Se falhar, tenta Criar Conta
      const { error: signUpErr } = await supabase.auth.signUp({ email, password: senha })
      if (signUpErr) alert("Erro: " + signUpErr.message)
      else alert("Conta criada! Clique em entrar novamente.")
    }

    setLoading(false) // DESATIVA O LOADING
  }

  // CÁLCULOS DO DASHBOARD
  const concluidos = dados.filter(i => i.status === 'concluido')
  const totalVendas = concluidos.reduce((acc, curr) => acc + Number(curr.valor), 0)

  if (!user) return (
    <div style={authBg}>
      <h2 style={{color:'#38bdf8', marginBottom:'30px'}}>BARBERFLOW</h2>
      <input style={inputS} placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
      <input style={inputS} type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      
      <button onClick={handleLogin} style={loading ? btnDisabled : btnMain} disabled={loading}>
        {loading ? 'PROCESSANDO...' : 'ENTRAR / CADASTRAR'}
      </button>
    </div>
  )

  return (
    <div style={bgMain}>
      {/* HEADER ESTILO SUNIZE */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
        <h1 style={{fontSize:'20px', fontWeight:'bold'}}>Dashboard</h1>
        <div style={avatarCircle}>P</div>
      </div>

      {/* CARDS PREMIUM */}
      <div style={cardS}>
        <div style={cardH}><span>Total em vendas</span><span>$</span></div>
        <h2 style={cardV}>R$ {totalVendas.toFixed(2)}</h2>
      </div>

      <div style={cardS}>
        <div style={cardH}><span>Quantidade de vendas</span><span>💳</span></div>
        <h2 style={cardV}>{concluidos.length}</h2>
      </div>

      <div style={{textAlign:'center', marginTop:'30px'}}>
        <button onClick={() => setStep('add')} style={btnMain}>+ NOVA VENDA</button>
        <button onClick={() => supabase.auth.signOut()} style={btnExit}>Sair da conta</button>
      </div>
    </div>
  )
}

// ESTILOS ATUALIZADOS
const authBg = { minHeight:'100vh', backgroundColor:'#0f172a', display:'flex', flexDirection:'column', justifyContent:'center', padding:'30px', textAlign:'center', fontFamily:'sans-serif' }
const bgMain = { minHeight:'100vh', backgroundColor:'#0f172a', color:'#fff', padding:'20px', fontFamily:'sans-serif' }
const inputS = { width:'100%', padding:'15px', backgroundColor:'#1e293b', border:'1px solid #334155', borderRadius:'12px', color:'#fff', marginBottom:'15px', boxSizing:'border-box', outline:'none' }
const btnMain = { width:'100%', padding:'18px', backgroundColor:'#38bdf8', color:'#000', border:'none', borderRadius:'12px', fontWeight:'900', fontSize:'14px', cursor:'pointer', transition:'0.3s' }
const btnDisabled = { ...btnMain, backgroundColor:'#1e293b', color:'#94a3b8', cursor:'not-allowed' }
const cardS = { backgroundColor:'#1e293b', padding:'20px', borderRadius:'16px', border:'1px solid #334155', marginBottom:'15px' }
const cardH = { display:'flex', justifyContent:'space-between', color:'#94a3b8', fontSize:'13px', fontWeight:'bold' }
const cardV = { fontSize:'30px', fontWeight:'bold', margin:'10px 0 0 0' }
const avatarCircle = { width:'40px', height:'40px', backgroundColor:'#1e293b', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #334155', fontWeight:'bold' }
const btnExit = { background:'none', border:'none', color:'#ef4444', marginTop:'20px', cursor:'pointer' }
