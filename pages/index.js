import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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

  // FUNÇÃO NOVA PARA REMOVER O CLIENTE
  async function remover(id) {
    await supabase.from('fila').delete().eq('id', id)
    carregarFila()
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>Fila de Espera 💈</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          placeholder="Nome do cliente" 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '60%', fontSize: '16px' }}
        />
        <button onClick={add} style={{ padding: '12px 20px', marginLeft: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add
        </button>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '10px' }}>
        {fila.length === 0 && <p style={{ color: '#888' }}>Fila vazia...</p>}
        {fila.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: i === fila.length - 1 ? 'none' : '1px solid #eee' }}>
            <span style={{ fontSize: '18px' }}><strong>{i + 1}º</strong> - {c.nome_cliente}</span>
            <button 
              onClick={() => remover(c.id)} 
              style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '12px' }}
            >
              Atendido
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
