import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

// RESET DE ESTILO (FUNDO PRETO TOTAL)
const ResetStyle = () => (
  <style>{`
    body { margin: 0; padding: 0; background-color: #000; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
  `}</style>
)

export default function BarberFlowUltimate() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('welcome')
  const [tab, setTab] = useState('dash')
  
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [dados, setDados] = useState([])
  
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
    // Carrega e ordena do mais recente para o mais antigo
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (data) setDados(data)
  }

  // --- NOVA FUNÇÃO: APAGAR VENDA ---
  async function apagarVenda(id) {
    const confirmacao = window.confirm("Tem certeza que deseja apagar essa venda?")
    if (confirmacao) {
      await supabase.from('agendamentos').delete().eq('id', id)
      carregarDados() // Atualiza a tela na hora
    }
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

  const vendasConfirmadas = dados.filter(i => i.status === 'concluido')
  const totalVendas = vendasConfirmadas.reduce((acc, curr) => acc + Number(curr.valor), 0)
  const meta = 1000

  // TELA 1: WELCOME
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

  // TELA 2: LOGIN
  if (view === 'login') return (
    <div style={styles.container}>
      <ResetStyle />
      <div style={styles.loginBox}>
        <h2 style={{...styles.title, fontSize: '24px', marginBottom: '30px'}}>Acesse sua conta</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label}>E-mail</label>
          <input style={styles.input} onChange={e => setEmail(e.target.value)} placeholder="admin@barber.com" />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Senha</label>
          <input style={styles.input} type="password" onChange={e => setSenha(e.target.value)} placeholder="••••••••" />
        </div>
        <button onClick={handleLogin} disabled={loading} style={styles.btnBlue}>
          {loading ? 'Entrando...' : 'Acessar Dashboard'}
        </button>
      </div>
    </div>
  )

  // TELA 3: APP
  if (view === 'app') return (
    <div style={styles.appContainer}>
      <ResetStyle />
      <div style={styles.header}>
        <div><p style={{fontSize: '12px', color: '#888'}}>Bem-vindo,</p><h3 style={{fontSize: '16px'}}>Barbeiro Pro</h3></div>
        <div style={styles.avatar}>B</div>
      </div>

      <div style={{paddingBottom: '80px'}}>
        
        {/* DASHBOARD + EXTRATO */}
        {tab === 'dash' && (
          <>
            <div style={styles.card}>
              <div style={styles.cardTop}><span>Vendas Hoje</span></div>
              <h1 style={{color: '#38bdf8', fontSize: '32px', margin: '5px 0'}}>R$ {totalVendas.toFixed(2)}</h1>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTop}><span>NÍVEL 1</span><span>Meta: 1k</span></div>
              <div style={styles.barBg}><div style={{...styles.barFill, width: `${Math.min((totalVendas/meta)*100, 100)}%`}}></div></div>
            </div>

            {/* LISTA DE VENDAS COM EXCLUSÃO */}
            <h3 style={{fontSize: '14px', color: '#888', marginTop: '20px', marginBottom: '10px'}}>Últimas Vendas</h3>
            {dados.length === 0 && <p style={{color: '#444', fontSize: '12px'}}>Nenhuma venda registrada.</p>}
            
            {dados.map(item => (
              <div key={item.id} style={styles.itemLista}>
                <div>
                  <div style={{fontWeight: 'bold', fontSize: '14px', color: '#fff'}}>{item.cliente}</div>
                  <div style={{fontSize: '11px', color: '#666'}}>Venda confirmada</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  <span style={{color: '#2dd4bf', fontWeight: 'bold'}}>+ R$ {item.valor}</span>
                  {/* BOTÃO DE APAGAR */}
                  <button onClick={() => apagarVenda(item.id)} style={styles.btnTrash}>🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* NOVA VENDA */}
        {tab === 'add' && (
          <div style={styles.card}>
            <h3>Registrar Serviço</h3>
            <label style={styles.label}>Cliente</label>
            <input style={styles.input} value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nome do cliente" />
            <label style={styles.label}>Valor (R$)</label>
            <input style={styles.input} type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="0.00" />
            <button onClick={async () => {
              if(!valor) return alert('Digite o valor!')
              await supabase.from('agendamentos').insert([{ cliente: cliente || 'Cliente', valor: valor, status: 'concluido' }])
              setValor(''); setCliente(''); carregarDados(); setTab('dash');
            }} style={{...styles.btnBlue, marginTop: '10px'}}>CONFIRMAR</button>
          </div>
        )}

        {/* PERFIL */}
        {tab === 'perfil' && (
          <div style={styles.card}>
             <h3>Configurações</h3>
             <button onClick={() => { supabase.auth.signOut(); setView('welcome') }} style={styles.btnOutline}>SAIR DA CONTA</button>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <div onClick={() => setTab('dash')} style={{...styles.tabItem, color: tab==='dash'?'#38bdf8':'#666'}}>🏠 Início</div>
        <div onClick={() => setTab('add')} style={{...styles.tabItem, color: tab==='add'?'#38bdf8':'#666'}}>➕ Vender</div>
        <div onClick={() => setTab('perfil')} style={{...styles.tabItem, color: tab==='perfil'?'#38bdf8':'#666'}}>👤 Perfil</div>
      </div>
    </div>
  )
}

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' },
  appContainer: { minHeight: '100vh', padding: '20px', backgroundColor: '#000', color: '#fff' },
  centerBox: { textAlign: 'center', width: '100%', maxWidth: '350px' },
  loginBox: { width: '100%', maxWidth: '350px', padding: '20px' },
  title: { fontSize: '32px', fontWeight: '900', margin: 0 },
  subtitle: { color: '#666', fontSize: '16px', marginBottom: '40px' },
  inputGroup: { marginBottom: '15px' },
  label: { fontSize: '12px', color: '#888', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '16px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px', color: '#fff', fontSize: '16px', outline: 'none' },
  btnBlue: { width: '100%', padding: '18px', backgroundColor: '#38bdf8', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '14px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' },
  btnOutline: { width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '14px', marginTop: '10px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  card: { backgroundColor: '#0f0f0f', padding: '20px', borderRadius: '16px', border: '1px solid #1a1a1a', marginBottom: '15px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '13px', marginBottom: '5px' },
  barBg: { width: '100%', height: '6px', backgroundColor: '#222', borderRadius: '10px', marginTop: '15px' },
  barFill: { height: '100%', backgroundColor: '#38bdf8', borderRadius: '10px' },
  footer: { position: 'fixed', bottom: 0, left: 0, width: '100%', height: '70px', backgroundColor: '#000', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 },
  tabItem: { fontSize: '12px', cursor: 'pointer', textAlign: 'center' },
  
  // ESTILOS DA LISTA DE VENDAS
  itemLista: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#111', borderRadius: '12px', marginBottom: '10px', border: '1px solid #222' },
  btnTrash: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '5px' }
}
