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

  async function remover(id) {
    // PROTEÇÃO: Pede a senha antes de deletar
    const senha = prompt("Digite a senha do Admin para remover:")
    
    if (senha === '10698080') { // <--- Altere sua senha aqui!
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    } else {
      alert("Senha incorreta!")
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '28px' }}>Fila de Espera 💈</h1>
      
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
        <input 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          placeholder="Nome do cliente" 
          style={{ padding: '15px', borderRadius: '10px 0 0 10px', border: '1px solid #ddd', width: '200px', fontSize: '16px', outline: 'none' }}
        />
        <button onClick={add} style={{ padding: '15px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer', fontWeight: 'bold' }}>
          Adicionar
        </button>
      </div>

      <div style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {fila.length === 0 && <p style={{ padding: '20px', color: '#999' }}>Ninguém na fila ainda...</p>}
        {fila.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: i === fila.length - 1 ? 'none' : '1px solid #f0f0f0' }}>
            <span style={{ fontSize: '18px', color: '#444' }}><strong>{i + 1}º</strong> - {c.nome_cliente}</span>
            <button 
              onClick={() => remover(c.id)} 
              style={{ backgroundColor: '#ffeded', color: '#ff4d4d', border: 'none', borderRadius: '8px', padding: '10px 15px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              Atendido
            </button>
          </div>
        ))}
      </div>
      
      <p style={{ marginTop: '40px', fontSize: '12px', color: '#aaa' }}>
        SaaS de Fila v1.0 - Protegido por Admin
      </p>
    </div>
  )
}
