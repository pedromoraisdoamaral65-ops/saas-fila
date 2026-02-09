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
      <div
