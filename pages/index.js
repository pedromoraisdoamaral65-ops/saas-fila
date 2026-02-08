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
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#ffffff', margin: 0, padding: 0, overflowX: 'hidden' }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Sistema de Gestão Completa</title>
      </Head>

      {/* HEADER ESTILO PREMIUM */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000000', borderBottom: '1px solid #111', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: '900', fontSize: '22px', color: '#ff7a00', letterSpacing: '-1px' }}>BarberFlow®</div>
        <button style={{ backgroundColor: '#ff7a00', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION - FOCO EM CONVERSÃO */}
      <section style={{ padding: '80px 5%', textAlign: 'center', background: 'linear-gradient(180deg, #000 0%, #050505 100%)' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1' }}>
          Agendamento online com <br/><span style={{ color: '#ff7a00' }}>gestão completa</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Tenha controle da agenda, financeiro e profissionais com um sistema simples e online.
        </p>
        
        <button style={{ backgroundColor: '#ff7a00', color: '#000', padding: '20px 40px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', marginBottom: '60px' }}>
          COMEÇAR TESTE GRÁTIS DE 10 DIAS
        </button>

        {/* COMPONENTE DE FILA (O coração do app) */}
        <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Entre na lista agora</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {['Cabelo', 'Barba', 'Combo'].map(s => (
              <button key={s} onClick={() => setServico(s)} style={{
                padding: '8px 16px', borderRadius: '50px', border: '1px solid #333',
                backgroundColor: servico === s ? '#ff7a00' : 'transparent',
                color: servico === s ? '#000' : '#fff', fontWeight: '700', fontSize: '12px'
              }}>{s}</button>
            ))}
          </div>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #222', backgroundColor: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#ff7a00', color: '#000', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: '900' }}>ENTRAR NA FILA</button>
        </div>
      </section>

      {/* SEÇÃO EXPERIMENTE GRÁTIS (Baseada no Print) */}
      <section style={{ padding: '60px 5%', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#111', padding: '50px 30px', borderRadius: '30px', border: '1px solid #222', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>Experimente grátis</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
            Acesso a todos os recursos, suporte humanizado e cadastros ilimitados durante 10 dias. Sem cartão, sem enrolação.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div style={{ padding: '20px', backgroundColor: '#000', borderRadius: '15px' }}>
              <h4 style={{ color: '#ff7a00', margin: '0 0 10px 0' }}>Financeiro</h4>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Controle faturamento e despesas em um só lugar.</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#000', borderRadius: '15px' }}>
              <h4 style={{ color: '#ff7a00', margin: '0 0 10px 0' }}>Comissões</h4>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Cálculo automático por barbeiro e serviço.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SUPORTE HUMANIZADO */}
      <section style={{ padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>🤝</div>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>Suporte humanizado de verdade</h2>
        <p style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
          No BarberFlow, você não fala com robôs. Conte com uma equipe dedicada pronta para ajudar sua barbearia a crescer.
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 5%', borderTop: '1px solid #111', backgroundColor: '#000', textAlign: 'center' }}>
        <div style={{ marginBottom: '30px' }}>
          <span style={{ color: '#ff7a00', fontWeight: '900' }}>BarberFlow®</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#555', fontSize: '13px' }}>
          <span>Termos de Uso</span>
          <span>Política de Privacidade</span>
        </div>
        <p style={{ color: '#222', fontSize: '11px', marginTop: '40px' }}>© 2026 Sistema BarberFlow - A revolução do seu negócio.</p>
      </footer>

      {/* BOTÃO WHATSAPP FLUTUANTE */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#25d366', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        📱
      </div>
    </div>
  )
            }
                       
