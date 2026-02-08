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
        <title>BarberFlow | Gestão Elite</title>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '30px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '2px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '60px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '15px 35px', borderRadius: '15px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION - GIGANTE */}
      <section style={{ padding: '100px 8%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px', background: 'radial-gradient(circle at top right, #f0fdfa, #ffffff)' }}>
        <div style={{ flex: '1 1 500px' }}>
          <h1 style={{ fontSize: '72px', fontWeight: '900', lineHeight: '1', marginBottom: '30px', letterSpacing: '-3px' }}>
            Domine o <span style={{ color: '#00a88f' }}>Fluxo</span> da sua Barbearia.
          </h1>
          <p style={{ fontSize: '26px', color: '#64748b', fontWeight: '400', marginBottom: '50px', maxWidth: '600px' }}>
            A tecnologia que transforma espera em experiência premium. Letras grandes para decisões grandes.
          </p>
          <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '25px 60px', borderRadius: '20px', fontWeight: '900', fontSize: '20px', boxShadow: '0 20px 40px rgba(0,168,143,0.3)' }}>
            QUERO MODERNIZAR AGORA
          </button>
        </div>

        {/* COMPONENTE DA FILA */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', background: '#fff', borderRadius: '40px', padding: '40px', boxShadow: '0 50px 100px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px' }}>Fila Online ⚡</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ padding: '22px', borderRadius: '18px', border: '2px solid #f1f5f9', fontSize: '18px', fontWeight: '700' }} />
            <select onChange={e => setServico(e.target.value)} style={{ padding: '22px', borderRadius: '18px', border: '2px solid #f1f5f9', fontSize: '18px', fontWeight: '700', backgroundColor: '#f8fafc' }}>
              <option>Corte</option>
              <option>Barba</option>
              <option>Combo VIP</option>
            </select>
            <button onClick={add} style={{ backgroundColor: '#0f172a', color: '#fff', padding: '22px', borderRadius: '18px', fontWeight: '900', fontSize: '18px', border: 'none', cursor: 'pointer' }}>ADICIONAR À FILA</button>
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '18px' }}>{i + 1}º {c.nome_cliente}</div>
                  <div style={{ color: '#00a88f', fontWeight: '700' }}>{c.servico}</div>
                </div>
                <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '900' }}>OK</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO DO VÍDEO "OBJETO FALANDO" */}
      <section style={{ padding: '100px 8%', backgroundColor: '#0f172a', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '48px', fontWeight: '900', marginBottom: '50px' }}>Como o BarberFlow fala com seu cliente</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,168,143,0.5)', border: '5px solid #1e293b' }}>
          <video autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }}>
            <source src="https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-hair-in-a-barber-shop-18961-large.mp4" type="video/mp4" />
          </video>
        </div>
        <p style={{ color: '#94a3b8', marginTop: '30px', fontSize: '20px' }}>Simples, rápido e visual. O fluxo que não para.</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '100px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '40px' }}>Pronto para o Flow?</h2>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '30px 80px', borderRadius: '100px', fontWeight: '900', fontSize: '24px', display: 'inline-block' }}>
          CHAMAR CONSULTOR
        </a>
      </footer>
    </div>
  )
              }
