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

  async function carregarFila() {
    const { data } = await supabase.from('fila').select('*').order('id')
    setFila(data || [])
  }

  useEffect(() => { carregarFila() }, [])

  async function add() {
    if (!nome) return
    await supabase.from('fila').insert([{ nome_cliente: nome }])
    setNome(''); carregarFila()
  }

  async function remover(id) {
    const senha = prompt("Acesso restrict. Digite a senha:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    } else if (senha !== null) {
      alert("Senha incorreta!")
    }
  }

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      width: '100vw', // Força largura total da janela
      fontFamily: "'Inter', sans-serif",
      color: '#fff',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute', // Garante que o fundo ignore margens do navegador
      top: 0,
      left: 0
    }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>Fila VIP | Barber Pro</title>
        <style>{`body { margin: 0; background-color: #0f172a; }`}</style>
      </Head>

      <div style={{ maxWidth: '500px', width: '90%', margin: '0 auto', padding: '40px 0', flex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>⚡</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0' }}>Fila VIP</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>Gestão de espera inteligente</p>
        </header>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            placeholder="Nome do cliente..." 
            style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#1e293b', color: '#fff', outline: 'none', width: '100%' }}
          />
          <button onClick={add} style={{ padding: '15px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
            Add
          </button>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '20px', border: '1px solid #334155', overflow: 'hidden' }}>
          {fila.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Fila vazia</div>
          ) : (
            fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: i === fila.length - 1 ? 'none' : '1px solid #334155' }}>
                <span><b style={{color: '#3b82f6'}}>{i + 1}º</b> {c.nome_cliente}</span>
                <button onClick={() => remover(c.id)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', padding: '5px 10px', fontSize: '12px' }}>Atendido</button>
              </div>
            ))
          )}
        </div>
      </div>

      <footer style={{ padding: '30px 20px', textAlign: 'center', background: '#0f172a' }}>
        <a href="https://wa.me/5500000000000" target="_blank" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold', fontSize: '14px' }}>
          🚀 Criar sistema para minha empresa
        </a>
      </footer>
    </div>
  )
  }
                  
