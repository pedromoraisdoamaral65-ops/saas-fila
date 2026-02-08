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
        <title>BarberFlow ® | Gestão e Agendamento Elite</title>
        <style>{`body { margin: 0; background: #000; }`}</style>
      </Head>

      {/* NAVBAR DARK TOTAL */}
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

        {/* CARD DE ENTRADA NA FILA */}
        <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#ff7a00' }}>Entre na fila digital agora</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {['Cabelo', 'Barba', 'Sobrancelha', 'Combo'].map(s => (
              <button key={s} onClick={() => setServico(s)} style={{
                padding: '8px 16px', borderRadius: '50px', border: '1px solid #333',
                backgroundColor: servico === s ? '#ff7a00' : 'transparent',
                color: servico === s ? '#000' : '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer'
              }}>{s}</button>
            ))}
          </div>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #222', backgroundColor: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box', fontWeight: '600' }} />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#ff7a00', color: '#000', padding: '15px', borderRadius: '8px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>CONFIRMAR {servico.toUpperCase()}</button>
          
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            {fila.length > 0 && <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>Atualmente na lista:</p>}
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #111' }}>
                <span style={{ fontWeight: '700', color: '#eee' }}>{i + 1}º {c.nome_cliente}</span>
                <span style={{ color: '#ff7a00', fontSize: '12px' }}>{c.servico}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO EXPERIMENTE GRÁTIS */}
      <section style={{ padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#0a0a0a', padding: '50px 30px', borderRadius: '30px', border: '1px solid #1a1a1a', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '20px' }}>Experimente grátis</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Acesso a todos os recursos do sistema, suporte humanizado e cadastros ilimitados durante 10 dias. Sem cartão e sem compromisso.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div style={{ padding: '25px', backgroundColor: '#000', borderRadius: '15px', border: '1px solid #111' }}>
              <div style={{fontSize: '24px', marginBottom: '10px'}}>💰</div>
              <h4 style={{ color: '#ff7a00', margin: '0 0 10px 0' }}>Controle Financeiro</h4>
              <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Acompanhe faturamento, despesas e lucros em tempo real.</p>
            </div>
            <div style={{ padding: '25px', backgroundColor: '#000', borderRadius: '15px', border: '1px solid #111' }}>
              <div style={{fontSize: '24px', marginBottom: '10px'}}>📊</div>
              <h4 style={{ color: '#ff7a00', margin: '0 0 10px 0' }}>Gestão de Comissões</h4>
              <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>Cálculo automático para cada barbeiro da sua equipe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO FAQ - PERGUNTAS FREQUENTES */}
      <section style={{ padding: '80px 5%', backgroundColor: '#050505' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', textAlign: 'center', marginBottom: '50px', color: '#ff7a00' }}>
          Dúvidas Frequentes
        </h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {[
            { q: "O teste de 10 dias é realmente grátis?", a: "Sim! Acesso total sem precisar cadastrar nenhum cartão de crédito." },
            { q: "Como meus clientes acessam a fila?", a: "Eles podem entrar na lista através de um link exclusivo da sua barbearia ou QR Code na bancada." },
            { q: "O suporte é feito por humanos?", a: "Sim. No BarberFlow você fala com uma equipe dedicada via WhatsApp, sem robôs." },
            { q: "Posso acessar pelo celular?", a: "Sim, o sistema é totalmente responsivo e funciona perfeitamente em computadores, tablets e smartphones." }
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: '#000', padding: '25px', borderRadius: '15px', marginBottom: '15px', border: '1px solid #111' }}>
              <h3 style={{ fontSize: '18px', color: '#ff7a00', marginTop: 0, marginBottom: '10px' }}>{item.q}</h3>
              <p style={{ color: '#888', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 5%', borderTop: '1px solid #111', backgroundColor: '#000', textAlign: 'center' }}>
        <div style={{ marginBottom: '30px' }}>
          <span style={{ color: '#ff7a00', fontWeight: '900', fontSize: '20px' }}>BarberFlow®</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: '#555', fontSize: '13px', marginBottom: '30px' }}>
          <span style={{cursor: 'pointer'}}>Termos de Uso</span>
          <span style={{cursor: 'pointer'}}>Privacidade</span>
          <span style={{cursor: 'pointer'}}>Suporte</span>
        </div>
        <p style={{ color: '#222', fontSize: '11px' }}>© 2026 BarberFlow ® — Gestão de Barbearias de Elite.</p>
      </footer>

      {/* BOTÃO WHATSAPP FLUTUANTE */}
      <div style={{ position: 'fixed', bottom: '25px', right: '25px', backgroundColor: '#25d366', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', zIndex: 1000 }}>
        <span style={{color: '#fff'}}>💬</span>
      </div>
    </div>
  )
}
