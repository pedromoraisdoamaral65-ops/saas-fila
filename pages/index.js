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
  const [servico, setServico] = useState('Corte')

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

  async function remover(id) {
    const senha = prompt("Acesso BarberFlow. Digite a senha:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow | O Fluxo Perfeito</title>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '40px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '900', fontSize: '12px' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION */}
      <section style={{ padding: '60px 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1', marginBottom: '20px', letterSpacing: '-2px' }}>
          Domine o <span style={{ color: '#00a88f' }}>Fluxo</span> da sua Barbearia.
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', maxWidth: '600px' }}>Organização premium para barbeiros de elite.</p>

        {/* COMPONENTE DA FILA */}
        <div style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '30px', padding: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', textAlign: 'left' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>Fila Online ⚡</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '700' }} />
            <select onChange={e => setServico(e.target.value)} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '700' }}>
              <option>Corte</option>
              <option>Barba</option>
              <option>Completo</option>
            </select>
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', padding: '15px', borderRadius: '12px', fontWeight: '900', border: 'none' }}>ADICIONAR</button>
          </div>
          <div style={{ marginTop: '20px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '15px', marginBottom: '10px' }}>
                <span style={{ fontWeight: '800' }}>{i + 1}º {c.nome_cliente} ({c.servico})</span>
                <button onClick={() => remover(c.id)} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: '900' }}>OK</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO DE IMAGENS E VÍDEO */}
      <section style={{ padding: '60px 5%', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '40px' }}>Veja como funciona</h2>
        
        {/* VÍDEO REAL */}
        <div style={{ maxWidth: '700px', margin: '0 auto 40px', borderRadius: '20px', overflow: 'hidden', border: '4px solid #1e293b' }}>
          <video autoPlay loop muted playsInline style={{ width: '100%' }}>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
        </div>

        {/* GRID DE IMAGENS REAIS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500" alt="Barbeiro" style={{ width: '100%', borderRadius: '15px' }} />
          <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500" alt="Corte" style={{ width: '100%', borderRadius: '15px' }} />
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <footer style={{ padding: '80px 5%', textAlign: 'center' }}>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '20px 40px', borderRadius: '50px', fontWeight: '900', fontSize: '18px', display: 'inline-block' }}>
          FALAR NO WHATSAPP
        </a>
      </footer>
    </div>
  )
}
