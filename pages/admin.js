import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function SunizeAuthDashboard() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState({ nome_barbeiro: 'Barbeiro', nome_barbearia: 'Minha Barbearia', avatar_url: '' })
  const [step, setStep] = useState('dash') // dash, add, perfil
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState('')
  const [dados, setDados] = useState([]); const [form, setForm] = useState({ cliente: '', valor: 50 })

  // 1. GERENCIAR LOGIN
  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)
    if (session?.user) carregarTudo()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) carregarTudo()
    })
    return () => subscription.unsubscribe()
  }, [])

  async function carregarTudo() {
    const { data: v } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (v) setDados(v)
    const { data: p } = await supabase.from('perfis').select('*').single()
    if (p) setPerfil(p)
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) { // Se não existe, tenta criar
      const { error: signUpErr } = await supabase.auth.signUp({ email, password: senha })
      if (signUpErr) alert(signUpErr.message)
      else alert('Conta criada! Verifique seu e-mail ou tente logar.')
    }
  }

  // 2. CÁLCULOS ESTILO SUNIZE
  const concluidos = dados.filter(i => i.status === 'concluido')
  const total = concluidos.reduce((acc, curr) => acc + Number(curr.valor), 0)
  const fila = dados.filter(i => i.status === 'pendente')

  if (!user) return (
    <div style={authContainer}>
      <h2 style={{color:'#38bdf8'}}>BARBERFLOW</h2>
      <p style={{color:'#94a3b8'}}>Faça login para acessar seu dashboard</p>
      <input style={inputS} placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
      <input style={inputS} type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <button onClick={handleLogin} style={btnMain}>ENTRAR / CADASTRAR</button>
    </div>
  )

  return (
    <div style={bgMain}>
      {/* HEADER DINÂMICO COM FOTO */}
      <div style={headerDash}>
        <div>
          <div style={{fontSize:'12px', color:'#94a3b8'}}>{perfil.nome_barbearia}</div>
          <div style={{fontSize:'18px', fontWeight:'bold'}}>Olá, {perfil.nome_barbeiro}</div>
        </div>
        <img 
          onClick={() => setStep('perfil')}
          src={perfil.avatar_url || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'} 
          style={avatarStyle} 
        />
      </div>

      {step === 'dash' && (
        <div style={{animation: 'fadeIn 0.5s'}}>
          <div style={cardS}>
            <div style={cardH}><span style={cardT}>Total em vendas</span><span>$</span></div>
            <h2 style={cardV}>R$ {total.toFixed(2)}</h2>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', margin:'20px 0'}}>
            <span style={{color:'#94a3b8', fontWeight:'bold'}}>FILA ({fila.length})</span>
            <button onClick={() => setStep('add')} style={btnTxt}>+ ADICIONAR</button>
          </div>
          {fila.map(i => (
            <div key={i.id} style={itemF}>
              <span>{i.cliente}</span>
              <button onClick={async () => {
                await supabase.from('agendamentos').update({status:'concluido'}).match({id: i.id})
                carregarTudo()
              }} style={btnCheck}>LIQUIDAR</button>
            </div>
          ))}
          <button onClick={() => supabase.auth.signOut()} style={{marginTop:'40px', color:'#ef4444', background:'none', border:'none', width:'100%'}}>Sair da conta</button>
        </div>
      )}

      {step === 'perfil' && (
        <div style={cardS}>
          <h3>Editar Perfil</h3>
          <label style={labelS}>URL DA FOTO</label>
          <input style={inputS} value={perfil.avatar_url} onChange={e => setPerfil({...perfil, avatar_url: e.target.value})} />
          <label style={labelS}>NOME DO BARBEIRO</label>
          <input style={inputS} value={perfil.nome_barbeiro} onChange={e => setPerfil({...perfil, nome_barbeiro: e.target.value})} />
          <button onClick={async () => {
            await supabase.from('perfis').upsert({ id: user.id, ...perfil })
            setStep('dash')
          }} style={btnMain}>SALVAR ALTERAÇÕES</button>
          <button onClick={() => setStep('dash')} style={btnTxt}>Voltar</button>
        </div>
      )}

      {step === 'add' && (
        <div style={cardS}>
          <h3>Nova Venda</h3>
          <input style={inputS} placeholder="Nome do Cliente" onChange={e => setForm({...form, cliente: e.target.value})} />
          <button onClick={async () => {
            await supabase.from('agendamentos').insert([{...form, status:'pendente'}])
            carregarTudo(); setStep('dash')
          }} style={btnMain}>CONFIRMAR</button>
        </div>
      )}
    </div>
  )
}

// ESTILOS SUNIZE PREMIUM
const bgMain = { minHeight:'100vh', backgroundColor:'#0f172a', color:'#f8fafc', padding:'20px', fontFamily:'sans-serif' }
const authContainer = { ...bgMain, display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center' }
const headerDash = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px' }
const avatarStyle = { width:'45px', height:'45px', borderRadius:'50%', border:'2px solid #1e293b', cursor:'pointer', objectFit:'cover' }
const cardS = { backgroundColor:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155', marginBottom:'15px' }
const cardH = { display:'flex', justifyContent:'space-between', color:'#94a3b8', fontSize:'13px' }
const cardV = { fontSize:'32px', fontWeight:'bold', margin:'10px 0 0 0' }
const inputS = { width:'100%', padding:'15px', backgroundColor:'#0f172a', border:'1px solid #334155', borderRadius:'10px', color:'#fff', marginBottom:'15px', boxSizing:'border-box' }
const btnMain = { width:'100%', padding:'15px', backgroundColor:'#38bdf8', color:'#000', border:'none', borderRadius:'10px', fontWeight:'bold' }
const btnTxt = { background:'none', border:'none', color:'#38bdf8', fontWeight:'bold' }
const itemF = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', backgroundColor:'#1e293b', borderRadius:'12px', marginBottom:'10px', border:'1px solid #334155' }
const btnCheck = { backgroundColor:'#0f172a', color:'#38bdf8', border:'1px solid #38bdf8', padding:'8px 15px', borderRadius:'8px', fontSize:'12px', fontWeight:'bold' }
const labelS = { fontSize:'10px', color:'#94a3b8', display:'block', marginBottom:'5px' }
