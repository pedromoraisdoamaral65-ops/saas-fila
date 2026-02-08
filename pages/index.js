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
    const senha = prompt("Senha BarberFlow:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  // Links estáveis para o carrossel estilo Netflix
  const imagensNetflix = [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1593702275677-f916c8c70ca4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512690118294-7004655fd4bb?auto=format&fit=crop&w=600&q=80"
  ]

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Sistema de Elite</title>
        <style>{`
          .netflix-row {
            display: flex;
            overflow-x: auto;
            gap: 15px;
            padding: 20px 0;
            scrollbar-width: none;
          }
          .netflix-row::-webkit-scrollbar { display: none; }
          .netflix-card {
            min-width: 280px;
            height: 160px;
            border-radius: 12px;
            background-size: cover;
            background-position: center;
            transition: transform 0.3s ease;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .netflix-card:hover { transform: scale(1.05); }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="Logo" style={{ height: '40px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '900' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION */}
      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '10px' }}>BarberFlow ®</h1>
        <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '40px' }}>Gestão de alta performance para barbearias.</p>

        {/* INPUT DA FILA */}
        <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #f1f5f9', fontWeight: '700' }} />
          <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '10px', fontWeight: '900' }}>ADD</button>
        </div>

        {/* FILA */}
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
          {fila.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: '800' }}>{i + 1}º {c.nome_cliente}</span>
              <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '900' }}>CONCLUIR</button>
            </div>
          ))}
        </div>
      </section>

      {/* MECÂNICA ESTILO NETFLIX */}
      <section style={{ padding: '40px 0 80px 8%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px' }}>Galeria do BarberFlow</h2>
        <div className="netflix-row">
          {imagensNetflix.map((img, idx) => (
            <div key={idx} className="netflix-card" style={{ backgroundImage: `url(${img})` }}></div>
          ))}
        </div>
      </section>

      {/* FOOTER COM LINKS E BOTÃO WHATSAPP */}
      <footer style={{ padding: '60px 8%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <a 
          href="https://wa.me/5500000000000" 
          style={{ 
            backgroundColor: '#25d366', 
            color: '#fff', 
            textDecoration: 'none', 
            padding: '20px 40px', 
            borderRadius: '12px', 
            fontWeight: '900', 
            display: 'inline-block', 
            marginBottom: '40px',
            boxShadow: '0 10px 20px rgba(37,211,102,0.2)'
          }}
        >
          FALAR NO WHATSAPP
        </a>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <a href="#" style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>TERMOS DE USO</a>
          <a href="#" style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>POLÍTICA DE PRIVACIDADE</a>
        </div>
        
        <p style={{ fontWeight: '900', fontSize: '14px' }}>BarberFlow ® — Desenvolvido por O Criador</p>
      </footer>
    </div>
  )
}
