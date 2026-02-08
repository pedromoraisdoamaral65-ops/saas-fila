import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head' // Para importar fontes

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
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    } else if (senha !== null) {
      alert("Senha incorreta!")
    }
  }

  return (
    <div style={{ backgroundColor: '#F3F4F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>Fila Digital | Barber Pro</title>
      </Head>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Cabeçalho */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '40px' }}>💈</span>
          <h1 style={{ color: '#111827', fontSize: '32px', fontWeight: '800', margin: '10px 0' }}>Fila Digital</h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Gerencie seus atendimentos em tempo real</p>
        </header>

        {/* Input de Adicionar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            placeholder="Nome do cliente..." 
            style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #E5E7EB', fontSize: '16px', outline: 'none', transition: '0.3s' }}
          />
          <button onClick={add} style={{ padding: '16px 24px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
            Add
          </button>
        </div>

        {/* Lista de Fila */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {fila.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
              <p>Nenhum cliente aguardando</p>
            </div>
          ) : (
            fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: i === fila.length - 1 ? 'none' : '1px solid #F3F4F6' }}>
                <div>
                  <span style={{ color: '#2563EB', fontWeight: '800', fontSize: '20px', marginRight: '12px' }}>{i + 1}º</span>
                  <span style={{ color: '#1F2937', fontWeight: '600', fontSize: '18px' }}>{c.nome_cliente}</span>
                </div>
                <button 
                  onClick={() => remover(c.id)} 
                  style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}
                >
                  Concluir
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer de Vendas */}
        <footer style={{ marginTop: '50px', textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '15px' }}>Desenvolvido por Pedro Morais</p>
          <a 
            href="https://wa.me/5561999445990" 
            target="_blank"
            style={{ textDecoration: 'none', color: '#2563EB', fontWeight: '700', fontSize: '15px', border: '1px solid #2563EB', padding: '10px 20px', borderRadius: '50px' }}
          >
            Obter este sistema para meu negócio
          </a>
        </footer>
      </div>
    </div>
  )
}
