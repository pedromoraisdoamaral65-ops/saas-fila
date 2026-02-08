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
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#ffffff', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Black & Orange Edition</title>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', borderBottom: '2px solid #ff7a00' }}>
        <div style={{ fontWeight: '900', fontSize: '24px', color: '#ff7a00' }}>BarberFlow®</div>
        <button style={{ backgroundColor: '#ff7a00', color: '#000', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: '800', cursor: 'pointer' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION */}
      <section style={{ padding: '60px 8%', textAlign: 'center', background: 'radial-gradient(circle, #1a1a1a 0%, #121212 100%)' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px' }}>Agende seu visual</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {['Cabelo', 'Barba', 'Sobrancelha', 'Combo'].map(item => (
            <button key={item} onClick={() => setServico(item)} style={{
              padding: '12px 30px', borderRadius: '50px', border: 'none',
              backgroundColor: servico === item ? '#ff7a00' : '#333',
              color: servico === item ? '#000' : '#fff',
              fontWeight: '700', cursor: 'pointer', transition: '0.3s'
            }}>{item}</button>
          ))}
        </div>

        {/* FORMULÁRIO DE FILA */}
        <div style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '30px', border: '1px solid #333' }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#000', color: '#fff', marginBottom: '20px', fontWeight: '600' }} />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#ff7a00', color: '#000', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '18px', cursor: 'pointer' }}>CONFIRMAR SERVIÇO</button>
          
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', color: '#ff7a00' }}>Próximos na fila:</h3>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #333' }}>
                <span style={{ fontWeight: '700' }}>{i + 1}º {c.nome_cliente}</span>
                <span style={{ color: '#ff7a00', fontSize: '12px' }}>{c.servico || 'Corte'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA DE OBJETOS FALANTES (TikTok Style) */}
      <section style={{ padding: '80px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '50px', color: '#ff7a00' }}>Apresentação de Objetos Falantes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {[
            { img: "https://i.postimg.cc/mD7XF6rN/tesoura-fala.png", nome: "Tesoura", fala: "Vou deixar você na régua!" },
            { img: "https://i.postimg.cc/85zK20M8/cadeira-fala.png", nome: "Cadeira", fala: "Sente e relaxe, você merece!" },
            { img: "https://picsum.photos/id/22/300/300", nome: "Prateleira", fala: "Tudo organizado para você." },
            { img: "https://picsum.photos/id/64/300/300", nome: "Borrifador", fala: "Hidratação é o segredo!" },
            { img: "https://picsum.photos/id/91/300/300", nome: "Barbeiro", fala: "Niguém aguarda mais na fila!" }
          ].map((obj, i) => (
            <div key={i} style={{ backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '20px', border: '1px solid #333' }}>
              <img src={obj.img} alt={obj.nome} style={{ width: '100%', borderRadius: '15px', marginBottom: '15px' }} />
              <h3 style={{ color: '#ff7a00', margin: '5px 0' }}>{obj.nome}</h3>
              <p style={{ fontStyle: 'italic', fontSize: '14px' }}>"{obj.fala}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO DE FEEDBACKS */}
      <section style={{ padding: '80px 8%', backgroundColor: '#000' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '50px' }}>Feedbacks</h2>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {[
            { nome: "João Silva", texto: "Melhor sistema que já usei na minha barbearia!", estrelas: "⭐⭐⭐⭐⭐" },
            { nome: "Mariana F.", texto: "A fila digital salvou meu sábado, muito prático.", estrelas: "⭐⭐⭐⭐⭐" },
            { nome: "Pedro S.", texto: "Design incrível e muito rápido de usar.", estrelas: "⭐⭐⭐⭐⭐" }
          ].map((f, i) => (
            <div key={i} style={{ minWidth: '300px', backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '20px', borderLeft: '5px solid #ff7a00' }}>
              <div style={{ color: '#ff7a00', marginBottom: '10px' }}>{f.estrelas}</div>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>"{f.texto}"</p>
              <div style={{ marginTop: '20px', fontWeight: '900', color: '#ff7a00' }}>- {f.nome}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 8%', textAlign: 'center', backgroundColor: '#121212', borderTop: '1px solid #333' }}>
        <p style={{ fontWeight: '900', color: '#ff7a00' }}>BarberFlow® 2026</p>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <a href="#" style={{ color: '#666', marginRight: '15px' }}>Termos de Uso</a>
          <a href="#" style={{ color: '#666' }}>Política de Privacidade</a>
        </div>
      </footer>
    </div>
  )
}
