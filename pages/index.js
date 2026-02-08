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
  const [servico, setServico] = useState('Cabelo')

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

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1a1a1a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Reservar Agora</title>
      </Head>

      {/* HEADER ESTILO FRESHA */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 100 }}>
        <div style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-1px' }}>BarberFlow<span style={{color: '#00a88f'}}>®</span></div>
        <button style={{ backgroundColor: '#1a1a1a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: '600', fontSize: '14px' }}>Baixar App</button>
      </nav>

      {/* HERO / BUSCA */}
      <section style={{ padding: '40px 5%', backgroundColor: '#f9f9f9', textAlign: 'left' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Agende seu visual</h1>
        <p style={{ color: '#666', marginBottom: '25px' }}>Os melhores barbeiros, na palma da sua mão.</p>
        
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          {['💇‍♂️ Cabelo', '🧔 Barba', '✨ Sobrancelha', '🔥 Combo'].map(cat => (
            <button key={cat} onClick={() => setServico(cat)} style={{ 
              padding: '10px 20px', borderRadius: '50px', border: '1px solid #ddd', 
              backgroundColor: servico === cat ? '#1a1a1a' : '#fff',
              color: servico === cat ? '#fff' : '#1a1a1a',
              whiteSpace: 'nowrap', fontWeight: '600', cursor: 'pointer'
            }}>{cat}</button>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO DE ENTRADA NA FILA */}
      <section style={{ padding: '30px 5%' }}>
        <div style={{ border: '1px solid #eee', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0 }}>Entrar na fila agora</h3>
          <input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            placeholder="Seu nome completo" 
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '16px', boxSizing: 'border-box' }} 
          />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#00a88f', color: '#fff', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
            Confirmar {servico}
          </button>
        </div>
      </section>

      {/* LISTA DE ESPERA ESTILO FEED */}
      <section style={{ padding: '0 5% 100px 5%' }}>
        <h3 style={{ marginBottom: '20px' }}>Próximos da lista</h3>
        {fila.length === 0 ? (
          <p style={{ color: '#999' }}>Ninguém aguardando no momento.</p>
        ) : (
          fila.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: '800' }}>
                  {c.nome_cliente[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '700' }}>{c.nome_cliente}</div>
                  <div style={{ fontSize: '13px', color: '#00a88f' }}>{c.servico || 'Corte'}</div>
                </div>
              </div>
              <div style={{ fontWeight: '600', color: '#666' }}>#{i + 1}</div>
            </div>
          ))
        )}
      </section>

      {/* TERMOS DE USO / FOOTER */}
      <footer style={{ padding: '40px 5%', borderTop: '1px solid #eee', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <a href="#" style={{ color: '#999', fontSize: '12px', textDecoration: 'none' }}>Termos de Uso</a>
          <a href="#" style={{ color: '#999', fontSize: '12px', textDecoration: 'none' }}>Privacidade</a>
        </div>
        <p style={{ fontSize: '12px', color: '#ccc' }}>BarberFlow ® — Sistema de Gestão Inteligente</p>
      </footer>
    </div>
  )
}
