import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function AppRecuperado() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('dash')
  const [dados, setDados] = useState([])
  const [perfil, setPerfil] = useState({ nome_barbeiro: 'Barbeiro', avatar_url: '' })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) carregarTudo()
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) carregarTudo()
    })
    return () => subscription.unsubscribe()
  }, [])

  async function carregarTudo() {
    const { data: v } = await supabase.from('agendamentos').select('*')
    if (v) setDados(v)
    const { data: p } = await supabase.from('perfis').select('*').single()
    if (p) setPerfil(p)
  }

  const totalVendas = dados.filter(i => i.status === 'concluido').reduce((acc, curr) => acc + Number(curr.valor), 0)

  if (loading) return <div style={{background:'#000', height:'100vh', color:'#fff', padding:'20px'}}>Iniciando...</div>

  if (!user) return (
    <div style={{background:'#000', height:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'30px', textAlign:'center'}}>
      <h1 style={{color:'#38bdf8', fontSize:'24px'}}>BARBERFLOW</h1>
      <p style={{color:'#666', marginBottom:'20px'}}>Faça login para continuar</p>
      <button onClick={() => window.location.reload()} style={{padding:'15px', borderRadius:'10px', border:'none', backgroundColor:'#38bdf8', fontWeight:'bold'}}>CLIQUE PARA LOGAR</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px 20px 80px 20px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{fontSize: '18px'}}>Dashboard</h2>
        <div onClick={() => setStep('perfil')} style={{width:'40px', height:'40px', borderRadius:'10px', backgroundColor:'#111', border:'1px solid #222', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>👤</div>
      </div>

      {step === 'dash' && (
        <>
          <p style={{fontSize:'12px', color:'#666', fontWeight:'bold'}}>RESUMO 👁️</p>
          <div style={kCard}>
            <span style={{fontSize:'13px', color:'#ccc'}}>Vendas hoje</span>
            <h2 style={{color: '#38bdf8', fontSize:'28px', margin:'5px 0'}}>R$ {totalVendas.toFixed(2)}</h2>
          </div>

          <div style={kCard}>
            <span style={{fontSize:'13px', color:'#ccc'}}>Saldo disponível</span>
            <h2 style={{color: '#2dd4bf', fontSize:'28px', margin:'5px 0'}}>R$ {totalVendas.toFixed(2)}</h2>
          </div>

          <button onClick={() => setStep('add')} style={btnMain}>+ LANÇAR VENDA</button>
          <button onClick={() => supabase.auth.signOut()} style={{width:'100%', background:'none', border:'none', color:'#444', marginTop:'20px'}}>Sair</button>
        </>
      )}

      {step === 'add' && (
        <div style={kCard}>
          <h3>Nova Venda</h3>
          <button onClick={async () => {
            await supabase.from('agendamentos').insert([{cliente: 'Venda Rápida', valor: 50, status: 'concluido'}])
            carregarTudo(); setStep('dash')
          }} style={btnMain}>CONFIRMAR R$ 50,00</button>
          <button onClick={() => setStep('dash')} style={{width:'100%', color:'#666', border:'none', background:'none', marginTop:'15px'}}>Voltar</button>
        </div>
      )}

      {step === 'perfil' && (
        <div style={kCard}>
          <h3>Perfil</h3>
          <p style={{fontSize:'12px', color:'#666'}}>Configurações em breve...</p>
          <button onClick={() => setStep('dash')} style={btnMain}>VOLTAR</button>
        </div>
      )}

      {/* FOOTER MENU */}
      <div style={{position:'fixed', bottom:0, left:0, right:0, height:'60px', backgroundColor:'#000', borderTop:'1px solid #222', display:'flex', justifyContent:'space-around', alignItems:'center'}}>
        <span onClick={() => setStep('dash')} style={{fontSize:'20px', cursor:'pointer'}}>🏠</span>
        <span style={{fontSize:'20px', opacity:0.3}}>🛒</span>
        <span style={{fontSize:'20px', opacity:0.3}}>💰</span>
        <span onClick={() => setStep('perfil')} style={{fontSize:'20px', cursor:'pointer'}}>👤</span>
      </div>
    </div>
  )
}

const kCard = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', marginBottom: '15px' }
const btnMain = { width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
