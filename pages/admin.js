import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function BarberFlowUltimate() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('welcome') // welcome, login, app
  const [tab, setTab] = useState('dash') // dash, add, perfil
  
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState([])
  
  // Variáveis para Nova Venda
  const [cliente, setCliente] = useState('')
  const [valor, setValor] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setView('app')
        carregarDados()
      }
    }
    checkSession()
  }, [])

  async function carregarDados() {
    try {
      const { data } = await supabase.from('agendamentos').select('*')
      if (data) setDados(data)
    } catch (e) { console.log("Erro ao carregar", e) }
  }

  const handleLogin = async () => {
    if (!email || !senha) return alert("Preencha tudo!")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      const { error: signUpErr } = await supabase.auth.signUp({ email, password: senha })
      if (!signUpErr) alert("Conta criada! Entre novamente.")
      else alert("Erro: " + error.message)
    } else {
      setView('app')
      carregarDados()
    }
    setLoading(false)
  }

  // Cálculos do Dashboard
  const vendasConfirmadas = dados.filter(i => i.status === 'concluido')
  const totalVendas = vendasConfirmadas.reduce((acc, curr) => acc + Number(curr.valor), 0)
  const meta = 1000 // Meta para barra de nível

  // --- COMPONENTES VISUAIS ---

  // 1. TELA DE BOAS VINDAS
  if (view === 'welcome') return (
    <div style={styles.container}>
      <ResetStyle />
      <div style={styles.centerBox}>
        <div style={{fontSize: '50px', marginBottom: '10px'}}>✂️</div>
        <h1 style={styles.title}>BARBER FLOW</h1>
        <p style={styles.subtitle}>Gestão de elite</p>
        <button onClick={() => setView('login')} style={styles.btnBlue}>ENTRAR</button>
      </div>
    </div>
  )

  // 2. TELA DE LOGIN (SEM ALERTAS FEIOS)
  if (view === 'login') return (
    <div style={styles.container}>
      <ResetStyle />
      <div style={styles.loginBox}>
        <h2 style={{...styles.title, fontSize: '24px', marginBottom: '30px'}}>Acesse sua conta</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>E-mail</label>
          <input style={styles.input} onChange={e => setEmail(e.target.value)} placeholder="barbeiro@email.com" />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Senha</label>
          <input style={styles.input} type="password" onChange={e => setSenha(e.target.value)} placeholder="••••••••" />
        </div>

        <p onClick={() => alert('📧 Um link de redefinição foi enviado para seu e-mail!')} style={styles.linkEsqueci}>
          Esqueceu sua senha?
        </p>

        <button onClick={handleLogin} disabled={loading} style={styles.btnBlue}>
          {loading ? 'Carregando...' : 'Acessar Dashboard'}
        </button>

        <p style={styles.footerText}>Não tem conta? Clique em acessar para criar.</p>
      </div>
    </div>
  )

  // 3. APLICAÇÃO (DASHBOARD COMPLETO)
  if (view === 'app') return (
    <div style={styles.appContainer}>
      <ResetStyle />
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <p style={{fontSize: '12px', color: '#888'}}>Bem-vindo,</p>
          <h3 style={{fontSize: '16px', fontWeight: 'bold'}}>Barbeiro Pro</h3>
        </div>
        <div style={styles.avatar}>B</div>
      </div>

      {/* CONTEÚDO DAS ABAS */}
      <div style={{paddingBottom: '80px'}}>
        
        {/* ABA: DASHBOARD */}
        {tab === 'dash' && (
          <>
            <p style={styles.sectionLabel}>VISÃO GERAL 👁️</p>
            
            {/* CARD AZUL (VENDAS) */}
            <div style={styles.card}>
              <div style={styles.cardTop}><span>Vendas Hoje</span><span style={{fontSize:'10px'}}>+ 12%</span></div>
              <h1 style={{color: '#38bdf8', fontSize: '32px', margin: '5px 0'}}>R$ {totalVendas.toFixed(2)}</h1>
            </div>

            {/* CARD VERDE (SALDO) */}
            <div style={styles.card}>
              <div style={styles.cardTop}><span>Disponível</span></div>
              <h1 style={{color: '#2dd4bf', fontSize: '32px', margin: '5px 0'}}>R$ {totalVendas.toFixed(2)}</h1>
            </div>

            {/* BARRA DE NÍVEL */}
            <div style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.tagNivel}>NÍVEL 1</span>
                <span style={{fontSize: '11px', color: '#888'}}>Meta: R$ 1.000</span>
              </div>
              <div style={styles.barBg}>
                <div style={{...styles.barFill, width: `${Math.min((totalVendas/meta)*100, 100)}%`}}></div>
              </div>
              <p style={{fontSize: '10px', color: '#555', marginTop: '5px'}}>Continue vendendo para subir de nível!</p>
            </div>

            <button onClick={() => setTab('add')} style={styles.btnBlue}>+ NOVA VENDA</button>
          </>
        )}

        {/* ABA: NOVA VENDA */}
        {tab === 'add' && (
          <div style={styles.card}>
            <h3 style={{marginBottom: '20px'}}>Registrar Serviço</h3>
            <label style={styles.label}>Nome do Cliente</label>
            <input style={styles.input} value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Ex: João Silva" />
            
            <label style={styles.label}>Valor (R$)</label>
            <input style={styles.input} type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="50.00" />
            
            <button onClick={async () => {
              if(!valor) return alert('Digite o valor!')
              await supabase.from('agendamentos').insert([{
                cliente: cliente || 'Cliente Balcão', 
                valor: valor, 
                status: 'concluido'
              }])
              setValor(''); setCliente(''); carregarDados(); setTab('dash');
            }} style={{...styles.btnBlue, marginTop: '10px'}}>CONFIRMAR VENDA</button>

            <button onClick={() => setTab('dash')} style={styles.btnOutline}>Cancelar</button>
          </div>
        )}

        {/* ABA: PERFIL / SAIR */}
        {tab === 'perfil' && (
          <div style={styles.card}>
             <h3>Configurações</h3>
             <button onClick={() => { supabase.auth.signOut(); setView('welcome') }} style={styles.btnOutline}>
               SAIR DA CONTA
             </button>
          </div>
        )}

      </div>

      {/* MENU INFERIOR FIXO */}
      <div style={styles.footer}>
        <div onClick={() => setTab('dash')} style={{...styles.tabItem, color: tab==='dash'?'#38bdf8':'#666'}}>🏠<br/>Início</div>
        <div onClick={() => setTab('add')} style={{...styles.tabItem, color: tab==='add'?'#38bdf8':'#666'}}>➕<br/>Vender</div>
        <div onClick={() => setTab('perfil')} style={{...styles.tabItem, color: tab==='perfil'?'#38bdf8':'#666'}}>👤<br/>Perfil</div>
      </div>

    </div>
  )
}

// RESET CSS GLOBAL (REMOVE BORDAS BRANCAS)
const ResetStyle = () => (
  <style>{`
    body { margin: 0; padding: 0; background-color: #000; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
  `}</style>
)

// ESTILOS DE ELITE
const styles = {
  container: { height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' },
  appContainer: { minHeight: '100vh', width: '100%', padding: '20px', backgroundColor: '#000', color: '#fff' },
  
  centerBox: { textAlign: 'center', width: '100%', maxWidth: '350px' },
  loginBox: { width: '100%', maxWidth: '350px', padding: '20px' },
  
  title: { fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-1px' },
  subtitle: { color: '#666', fontSize: '16px', marginBottom: '40px' },
  
  inputGroup: { marginBottom: '15px' },
  label: { fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '16px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none' },
  
  btnBlue: { width: '100%', padding: '18px', backgroundColor: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '14px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  btnOutline: { width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '14px', marginTop: '10px' },
  
  linkEsqueci: { textAlign: 'right', color: '#38bdf8', fontSize: '13px', marginTop: '10px', marginBottom: '30px', cursor: 'pointer' },
  footerText: { textAlign: 'center', color: '#555', fontSize: '13px', marginTop: '30px' },

  // Dashboard Styles
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  
  sectionLabel: { fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '10px', letterSpacing: '1px' },
  
  card: { backgroundColor: '#0f0f0f', padding: '20px', borderRadius: '16px', border: '1px solid #1a1a1a', marginBottom: '15px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '13px', marginBottom: '5px' },
  
  tagNivel: { backgroundColor: '#1a1a1a', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', color: '#fff' },
  barBg: { width: '100%', height: '6px', backgroundColor: '#222', borderRadius: '10px', marginTop: '15px' },
  barFill: { height: '100%', backgroundColor: '#38bdf8', borderRadius: '10px', transition: 'width 0.5s ease' },
  
  footer: { position: 'fixed', bottom: 0, left: 0, width: '100%', height: '70px', backgroundColor: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 },
  tabItem: { textAlign: 'center', fontSize: '10px', cursor: 'pointer' }
}
