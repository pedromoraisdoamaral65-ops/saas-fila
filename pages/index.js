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
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", color: '#1e293b', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>BarberFlow | Gestão Profissional</title>
        <style>{`
          body { margin: 0; padding: 0; }
          @media (max-width: 900px) {
            .hero-container { flex-direction: column !important; text-align: center !important; }
            .hero-text { text-align: center !important; margin-bottom: 40px !important; }
            .hero-title { fontSize: 32px !important; }
          }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '15px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '45px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>TESTE GRÁTIS</button>
      </nav>

      {/* SEÇÃO HERO EM COLUNAS (ESTILO TRINKS) */}
      <section style={{ 
        padding: '100px 8%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
        gap: '40px'
      }} className="hero-container">
        
        {/* COLUNA ESQUERDA: TEXTO */}
        <div style={{ flex: 1, textAlign: 'left' }} className="hero-text">
          <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', color: '#0f172a', marginBottom: '25px' }} className="hero-title">
            Escolha um sistema completo para <span style={{ color: '#00a88f' }}>gestão de barbearia</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px', maxWidth: '500px' }}>
            Agilidade no atendimento e controle total da sua fila para lucrar mais com gestão fácil.
          </p>
          <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: '50px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 10px 20px rgba(0,168,143,0.3)' }}>
            TESTE GRÁTIS POR 5 DIAS
          </button>
        </div>

        {/* COLUNA DIREITA: COMPONENTE DA FILA */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%',
            maxWidth: '420px', 
            background: '#ffffff', 
            borderRadius: '32px', 
            padding: '35px', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)', 
            border: '1px solid #f1f5f9' 
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#00a88f' }}>●</span> Agenda Online
            </h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do cliente" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #f1f5f9', outline: 'none' }} />
              <button onClick={add} style={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '14px', padding: '0 20px', fontWeight: 'bold' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fila.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', backgroundColor: '#f8fafc', borderRadius: '18px' }}>
                  <span style={{ fontWeight: '700' }}><span style={{ color: '#00a88f' }}>{i + 1}º</span> {c.nome_cliente}</span>
                  <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '11px' }}>CONCLUIR</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO EXPLICAÇÃO - CARDS EM COLUNAS */}
      <section style={{ padding: '100px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '60px' }}>Dê adeus à comanda de papel</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          <div style={{ padding: '30px', borderRadius: '24px', backgroundColor: '#f8fafc', textAlign: 'left' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>📱</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>App para barbeiros</h3>
            <p style={{ color: '#64748b' }}>Controle total da sua agenda e fila de espera direto pelo seu smartphone.</p>
          </div>

          <div style={{ padding: '30px', borderRadius: '24px', backgroundColor: '#f8fafc', textAlign: 'left' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>⚡</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>Fila em tempo real</h3>
            <p style={{ color: '#64748b' }}>Seus clientes acompanham o tempo estimado de espera de forma transparente.</p>
          </div>

          <div style={{ padding: '30px', borderRadius: '24px', backgroundColor: '#f8fafc', textAlign: 'left' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>💰</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>Pagamentos Online</h3>
            <p style={{ color: '#64748b' }}>Reduza as faltas e aumente sua receita com integração de pagamentos.</p>
          </div>

        </div>
      </section>

      {/* CTA FOOTER */}
      <footer style={{ padding: '80px 8%', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px' }}>Pronto para lucrar mais?</h2>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '20px 60px', borderRadius: '50px', fontWeight: 'bold', fontSize: '18px', display: 'inline-block' }}>
          QUERO O BARBERFLOW AGORA
        </a>
        <p style={{ marginTop: '50px', color: '#475569', fontSize: '13px' }}>© 2024 BarberFlow. A revolução na sua barbearia.</p>
      </footer>
    </div>
  )
  }
  
