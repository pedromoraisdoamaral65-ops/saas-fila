import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function KirvanoDashboard() {
  const [user, setUser] = useState(null)
  const [perfil, setPerfil] = useState({ nome_barbeiro: 'Barbeiro', avatar_url: '' })
  const [step, setStep] = useState('dash') 
  const [dados, setDados] = useState([])
  const [form, setForm] = useState({ cliente: '', valor: 50 })

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

  const concluidos = dados.filter(i => i.status === 'concluido')
  const totalVendas = concluidos.reduce((acc, curr) => acc + Number(curr.valor), 0)

  if (!user) return <div style={{color: '#fff', textAlign: 'center', padding: '50px'}}>Carregando App...</div>

  return (
    <div style={kirvanoBg}>
      
      {/* HEADER KIRVANO */}
      <div style={kHeader}>
        <h2 style={{fontSize: '18px', margin: 0}}>Dashboard</h2>
        <img 
          onClick={() => setStep('perfil')} 
          src={perfil.avatar_url || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'} 
          style={kAvatar} 
        />
      </div>

      {step === 'dash' && (
        <div style={{animation: 'fadeIn 0.3s'}}>
          <p style={kLabelHeader}>RESUMO 👁️</p>

          <div style={kCard}>
            <div style={kCardTop}><span>Vendas hoje</span><span style={kSmallText}>Ontem R$ 0,00</span></div>
            <h2 style={{...kValue, color: '#38bdf8'}}>R$ {totalVendas.toFixed(2)}</h2>
          </div>

          <div style={kCard}>
            <div style={kCardTop}><span>Pendente</span></div>
            <h2 style={{...kValue, color: '#fbbf24'}}>R$ 0,00</h2>
          </div>

          <div style={kCard}>
            <div style={kCardTop}><span>Saldo disponível</span></div>
            <h2 style={{...kValue, color: '#2dd4bf'}}>R$ {totalVendas.toFixed(2)}</h2>
          </div>

          {/* BARRA DE NÍVEL ESTILO KIRVANO */}
          <div style={kCard}>
            <div style={kCardTop}>
               <span style={kNivelTag}>Nível 1</span>
               <span style={kSmallText}>R$ {totalVendas.toFixed(2)} em vendas</span>
            </div>
            <div style={kBarBg}><div style={{...kBarFill, width: `${Math.min(totalVendas/10, 100)}%`}}></div></div>
            <div style={kCardTop}><span style={kSmallText}>0</span><span style={kSmallText}>1.000</span></div>
          </div>

          <button onClick={() => setStep('add')} style={kBtnMain}>+ LANÇAR VENDA</button>
          <button onClick={() => supabase.auth.signOut()} style={kBtnSair}>Sair da conta</button>
        </div>
      )}

      {step === 'add' && (
        <div style={kCard}>
          <h3 style={{marginBottom: '20px'}}>Nova Venda</h3>
          <input style={kInput} placeholder="Nome do Cliente" onChange={e => setForm({...form, cliente: e.target.value})} />
          <input style={kInput} type="number" placeholder="Valor R$" onChange={e => setForm({...form, valor: e.target.value})} />
          <button onClick={async () => {
            await supabase.from('agendamentos').insert([{...form, status: 'concluido'}])
            carregarTudo(); setStep('dash')
          }} style={kBtnMain}>CONFIRMAR</button>
          <button onClick={() => setStep('dash')} style={kBtnSair}>Voltar</button>
        </div>
      )}

      {step === 'perfil' && (
        <div style={kCard}>
          <h3>Configurações</h3>
          <label style={kLabel}>NOME DO BARBEIRO</label>
          <input style={kInput} value={perfil.nome_barbeiro} onChange={e => setPerfil({...perfil, nome_barbeiro: e.target.value})} />
          <label style={kLabel}>LINK DA FOTO</label>
          <input style={kInput} value={perfil.avatar_url} onChange={e => setPerfil({...perfil, avatar_url: e.target.value})} />
          <button onClick={async () => {
            await supabase.from('perfis').upsert({ id: user.id, ...perfil })
            carregarTudo(); setStep('dash')
          }} style={kBtnMain}>SALVAR</button>
          <button onClick={() => setStep('dash')} style={kBtnSair}>Voltar</button>
        </div>
      )}

      {/* MENU INFERIOR KIRVANO */}
      <div style={kFooter}>
        <div style={kTab} onClick={() => setStep('dash')}>🏠 <br/>Dash</div>
        <div style={kTab}>🛒 <br/>Vendas</div>
        <div style={kTab}>💰 <br/>Financeiro</div>
        <div style={kTab} onClick={() => setStep('perfil')}>👤 <br/>Mais</div>
      </div>
    </div>
  )
}

// ESTILOS KIRVANO
const kirvanoBg = { minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px 20px 100px 20px', fontFamily: 'sans-serif' }
const kHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }
const kAvatar = { width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', objectFit: 'cover', border: '1px solid #333' }
const kLabelHeader = { fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '15px' }
const kCard = { backgroundColor: '#111', padding: '15px', borderRadius: '12px', border: '1px solid #222', marginBottom: '12px' }
const kCardTop = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#ccc' }
const kValue = { fontSize: '24px', fontWeight: 'bold', margin: 0 }
const kSmallText = { fontSize: '11px', color: '#555' }
const kNivelTag = { backgroundColor: '#222', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }
const kBarBg = { width: '100%', height: '6px', backgroundColor: '#222', borderRadius: '10px', margin: '10px 0' }
const kBarFill = { height: '100%', backgroundColor: '#38bdf8', borderRadius: '10px' }
const kBtnMain = { width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '10px' }
const kBtnSair = { width: '100%', background: 'none', border: 'none', color: '#666', marginTop: '15px', fontSize: '13px' }
const kInput = { width: '100%', padding: '12px', backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }
const kLabel = { fontSize: '10px', color: '#666', marginBottom: '5px', display: 'block' }
const kFooter = { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }
const kTab = { textAlign: 'center', fontSize: '10px', color: '#666', cursor: 'pointer' }
