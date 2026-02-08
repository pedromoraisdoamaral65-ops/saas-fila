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
    const senha = prompt("Acesso restrito BarberFlow. Digite a senha:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", color: '#0f172a' }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>BarberFlow | Gestão de Fluxo Inteligente</title>
      </Head>

      {/* Header BarberFlow */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: '800', fontSize: '24px', color: '#00a88f', letterSpacing: '-1px' }}>
          Barber<span style={{color: '#1e293b'}}>Flow</span>
        </div>
        <button style={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: '600', fontSize: '14px' }}>Área do Barbeiro</button>
      </nav>

      {/* Seção de Vendas + Fila Real */}
      <div style={{ padding: '60px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', color: '#1e293b' }}>
          O fluxo perfeito para sua <span style={{color: '#00a88f'}}>Barbearia</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>Organize seus atendimentos com a velocidade de um clique.</p>
        
        {/* Card da Fila */}
        <div style={{ 
          maxWidth: '450px', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          borderRadius: '30px', 
          padding: '30px', 
          boxShadow: '0 25px 50px -12px rgba(0, 168, 143, 0.15)',
          border: '1px solid #f1f5f9',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00a88f', boxShadow: '0 0 10px #00a88f' }}></div>
             <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Fila de Espera ao Vivo</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              placeholder="Nome do cliente" 
              style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '16px', outline: 'none', background: '#f8fafc' }}
            />
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', borderRadius: '16px', padding: '0 25px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0, 168, 143, 0.3)' }}>Add</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {fila.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Ninguém na fila. Que tal adicionar alguém?</p>
            ) : (
              fila.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700' }}>
                    <span style={{ color: '#00a88f', marginRight: '10px' }}>{i + 1}º</span> {c.nome_cliente}
                  </span>
                  <button onClick={() => remover(c.id)} style={{ color: '#00a88f', background: 'none', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>CONCLUIR</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Profissional */}
      <footer style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#1e293b', color: '#fff' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>Leve o BarberFlow para seu negócio</h3>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>A tecnologia que faltava na sua cadeira.</p>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '15px 40px', borderRadius: '50px', fontWeight: 'bold', display: 'inline-block' }}>Falar com Suporte</a>
      </footer>
    </div>
  )
}
