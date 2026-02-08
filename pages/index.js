import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// O site vai ler as chaves direto da Vercel por segurança
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

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Fila de Espera 💈</h1>
      <input 
        value={nome} 
        onChange={e => setNome(e.target.value)} 
        placeholder="Nome do cliente" 
        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '250px' }}
      />
      <button onClick={add} style={{ padding: '12px 20px', marginLeft: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
        Adicionar
      </button>

      <div style={{ marginTop: '30px', maxWidth: '350px', margin: '30px auto', textAlign: 'left' }}>
        {fila.map((c, i) => (
          <div key={c.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
            <strong>{i + 1}º</strong> - {c.nome_cliente}
          </div>
        ))}
      </div>
    </div>
  )
  }
        
