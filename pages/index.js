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
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#ffffff', margin: 0, padding: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Black & Orange</title>
      </Head>

      {/* NAVBAR SEM BORDAS BRANCAS */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <div style={{ fontWeight: '900', fontSize: '24px', color: '#ff7a00' }}>BarberFlow®</div>
        <button style={{ backgroundColor: '#ff7a00', color: '#000', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: '800' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO COM OBJETOS FALANTES INTEGRADOS */}
      <section style={{ padding: '40px 5%', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {/* Objeto: Tesoura */}
          <div style={{ position: 'relative', width: '100px' }}>
             <div style={{ backgroundColor: '#ff7a00', color: '#000', fontSize: '10px', padding: '5px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '5px' }}>"Vou te deixar na régua!"</div>
             <img src="https://i.postimg.cc/mD7XF6rN/tesoura-fala.png" style={{ width: '100%' }} />
          </div>
          {/* Objeto: Cadeira */}
          <div style={{ position: 'relative', width: '120px' }}>
             <img src="https://i.postimg.cc/85zK20M8/cadeira-fala.png" style={{ width: '100%' }} />
          </div>
          {/* Objeto: Borrifador */}
          <div style={{ position: 'relative', width: '80px' }}>
             <div style={{ backgroundColor: '#ff7a00', color: '#000', fontSize: '10px', padding: '5px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '5px' }}>"Sente e relaxe!"</div>
             <img src="https://i.postimg.cc/mD7XF6rN/tesoura-fala.png" style={{ width: '100%', opacity: 0 }} /> {/* Spacer */}
             <div style={{ position: 'absolute', bottom: 0 }}><span style={{fontSize: '40px'}}>🧴</span></div>
          </div>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '30px', lineHeight: '1.1' }}>Agende seu visual</h1>

        {/* CATEGORIAS ESTILO FRESHA / DARK */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['Cabelo', 'Barba', 'Sobrancelha', 'Combo'].map(item => (
            <button key={item} onClick={() => setServico(item)} style={{
              padding: '12px 25px', borderRadius: '50px', border: 'none',
              backgroundColor: servico === item ? '#ff7a00' : '#222',
              color: servico === item ? '#000' : '#fff',
              fontWeight: '700', cursor: 'pointer'
            }}>{item}</button>
          ))}
        </div>

        {/* FORMULÁRIO LIMPO */}
        <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#111', padding: '30px', borderRadius: '25px' }}>
          <input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            placeholder="Seu nome" 
            style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#000', color: '#fff', marginBottom: '15px', boxSizing: 'border-box' }} 
          />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#ff7a00', color: '#000', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px' }}>
            CONFIRMAR SERVIÇO
          </button>
        </div>
      </section>

      {/* FEEDBACKS NO FINAL */}
      <section style={{ padding: '60px 5%', backgroundColor: '#000' }}>
        <h2 style={{ color: '#ff7a00', textAlign: 'center', fontWeight: '900', marginBottom: '40px' }}>Feedbacks</h2>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ minWidth: '280px', backgroundColor: '#111', padding: '20px', borderRadius: '20px' }}>
              <div style={{ color: '#ff7a00', marginBottom: '10px' }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: '14px', color: '#ccc' }}>"O melhor sistema de gestão que já usei na minha barbearia. Meus clientes adoram!"</p>
              <p style={{ fontWeight: 'bold', marginTop: '15px' }}>Barbeiro Elite {i}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 5%', textAlign: 'center', color: '#444', fontSize: '12px' }}>
        <p>BarberFlow ® 2026 — Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
