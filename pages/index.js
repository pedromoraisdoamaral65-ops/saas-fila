import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Home() {
  const [fila, setFila] = useState([])
  const [nome, setNome] = useState('')
  const [servico, setServico] = useState('Corte')

  async function carregarFila() {
    const { data } = await supabase.from('fila').select('*').order('id')
    setFila(data || [])
  }

  useEffect(() => { carregarFila() }, [])

  async function add() {
    if (!nome) return
    await supabase.from('fila').insert([{ nome_cliente: nome, servico: servico }])
    setNome(''); carregarFila()
  }

  async function remover(id) {
    const senha = prompt("Acesso BarberFlow. Digite a senha:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Gestão Profissional</title>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '25px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '45px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>TESTE GRÁTIS</button>
      </nav>

      {/* SEÇÃO PRINCIPAL (HERO) - SEM O FUNDO BRANCO SEPARADO */}
      <section style={{ 
        padding: '80px 8%', 
        textAlign: 'center', 
        background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-2px' }}>
          Domine o <span style={{ color: '#00a88f' }}>Fluxo</span> da sua Barbearia.
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '50px', maxWidth: '600px', fontWeight: '500' }}>
          Organização premium para barbeiros que não aceitam menos que o topo.
        </p>

        {/* CARD DA FILA CENTRAL
