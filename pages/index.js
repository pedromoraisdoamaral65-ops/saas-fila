import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const zapUrl = "https://wa.me/5561999445990?text=Olá,%20vim%20pela%20página%20e%20quero%20saber%20como%20funciona."

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#ffffff', margin: 0, padding: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Estilo Netflix</title>
        <style>{`
          body { margin: 0; background: #000; overflow-x: hidden; }
          .hero-gradient {
            background: linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 50%, rgba(0,123,255,0.2) 100%);
          }
          .btn-netflix:hover { transform: scale(1.05); background-color: #0056b3 !important; }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', width: '100%', zIndex: 10, boxSizing: 'border-box' }}>
        <div style={{ fontWeight: '900', fontSize: '28px', color: '#007bff', letterSpacing: '-1.5px' }}>BARBERFLOW</div>
        <a href={zapUrl} style={{ backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: '700', fontSize: '14px' }}>Entrar</a>
      </nav>

      {/* HERO SECTION - ESTILO NETFLIX */}
      <section className="hero-gradient" style={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: '900', maxWidth: '800px', margin: '0 0 20px 0', lineHeight: '1.1' }}>
          Agendamento ilimitado, <br/> gestão sem esforço.
        </h1>
        <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', marginBottom: '40px', maxWidth: '700px', color: '#ccc' }}>
          Assuma o controle da sua barbearia hoje. Cancele quando quiser.
        </p>
        
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={zapUrl} className="btn-netflix" style={{ 
            backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', padding: '20px 40px', 
            borderRadius: '4px', fontSize: '24px', fontWeight: '700', transition: '0.3s', display: 'flex', alignItems: 'center' 
          }}>
            QUERO SABER COMO FUNCIONA <span style={{ marginLeft: '15px' }}>&gt;</span>
          </a>
        </div>
      </section>

      {/* SEÇÃO DE CARDS - "POPULARES NO BARBERFLOW" */}
      <section style={{ padding: '0 5% 80px 5%', marginTop: '-100px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Recursos em destaque</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {[
            { t: "Fila Online", desc: "Seu cliente agenda pelo Whats." },
            { t: "Financeiro", desc: "Controle total de caixa." },
            { t: "Comissões", desc: "Cálculo automático p/ barbeiro." },
            { t: "Relatórios", desc: "Sua barbearia em números." },
            { t: "Multi-unidade", desc: "Gerencie várias lojas." }
          ].map((item, i) => (
            <div key={i} style={{ 
              backgroundColor: '#141414', borderRadius: '4px', padding: '20px', minHeight: '150px',
              transition: '0.3s', cursor: 'pointer', border: '1px solid #222'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <h3 style={{ color: '#007bff', fontSize: '18px', marginBottom: '10px' }}>{item.t}</h3>
              <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ESTILO NETFLIX (ACORDEON SIMULADO) */}
      <section style={{ padding: '80px 5%', borderTop: '8px solid #222' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '900', textAlign: 'center', marginBottom: '50px' }}>Perguntas frequentes</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {[
            "O que é o BarberFlow?",
            "Quanto custa a assinatura?",
            "Como funciona o suporte?",
            "Posso cancelar a qualquer momento?"
          ].map((q, i) => (
            <div key={i} style={{ backgroundColor: '#2d2d2d', padding: '20px 30px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '20px', fontWeight: '500' }}>{q}</span>
              <span style={{ fontSize: '30px' }}>+</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>Pronto para transformar sua barbearia?</p>
          <a href={zapUrl} style={{ backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', padding: '15px 30px', borderRadius: '4px', fontWeight: '700' }}>FALAR COM CONSULTOR</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '50px 5%', color: '#757575', fontSize: '14px', borderTop: '8px solid #222' }}>
        <p style={{ marginBottom: '30px' }}>Dúvidas? Ligue 0800-BARBER-FLOW</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', maxWidth: '1000px' }}>
          <span>Termos de Uso</span>
          <span>Privacidade</span>
          <span>Centro de Ajuda</span>
          <span>Conta</span>
        </div>
        <p style={{ marginTop: '50px', fontSize: '12px' }}>BarberFlow Brasil</p>
      </footer>
    </div>
  )
}
