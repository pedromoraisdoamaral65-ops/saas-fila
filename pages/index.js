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
    const senha = prompt("Acesso restrito. Digite a senha:")
    if (senha === '10698080') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    } else if (senha !== null) {
      alert("Senha incorreta!")
    }
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif",
      color: '#fff'
    }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>Fila VIP | Barber Pro</title>
      </Head>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Cabeçalho */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>⚡</div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', margin: '0' }}>Fila VIP</h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', marginTop: '8px' }}>Gerenciamento inteligente de espera</p>
        </header>

        {/* Input de Adicionar */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            placeholder="Nome do próximo cliente..." 
            style={{ 
              flex: 1, 
              padding: '16px', 
              borderRadius: '14px', 
              border: 'none', 
              fontSize: '16px', 
              outline: 'none',
              background: 'transparent',
              color: '#fff'
            }}
          />
          <button onClick={add} style={{ 
            padding: '16px 28px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '16px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '16px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            Add
          </button>
        </div>

        {/* Lista de Fila */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.7)', 
          borderRadius: '28px', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden' 
        }}>
          {fila.length === 0 ? (
            <div style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
              <p>Aguardando novos clientes...</p>
            </div>
          ) : (
            fila.map((c, i) => (
              <div key={c.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px', 
                borderBottom: i === fila.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)' 
              }}>
                <div>
                  <span style={{ color: '#3b82f6', fontWeight: '800', fontSize: '20px', marginRight: '15px' }}>#{i + 1}</span>
                  <span style={{ fontWeight: '600', fontSize: '18px' }}>{c.nome_cliente}</span>
                </div>
                <button 
                  onClick={() => remover(c.id)} 
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                    color: '#ef4444', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    borderRadius: '12px', 
                    padding: '10px 18px', 
                    cursor: 'pointer', 
                    fontSize: '14px', 
                    fontWeight: '700' 
                  }}
                >
                  Concluir
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Comercial */}
        <footer style={{ marginTop: '60px', textAlign: 'center' }}>
          <a 
            href="https://wa.me/5561999445990" 
            target="_blank"
            style={{ 
              textDecoration: 'none', 
              color: '#fff', 
              fontWeight: '600', 
              fontSize: '14px', 
              background: 'linear-gradient(to right, #1d4ed8, #3b82f6)', 
              padding: '12px 24px', 
              borderRadius: '50px',
              display: 'inline-block',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}
          >
            🚀 Ativar para minha empresa
          </a>
        </footer>
      </div>
    </div>
  )
}
