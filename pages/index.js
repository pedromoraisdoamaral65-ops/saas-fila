import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Fluxo de redirecionamento para o WhatsApp
  const irParaWhats = () => {
    setLoading(true)
    setTimeout(() => {
      const msg = encodeURIComponent("Olá! Vim pelo site e quero ativar meu teste grátis no BarberFlow® agora.")
      window.location.href = `https://wa.me/5599999999999?text=${msg}`
    }, 2500)
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, padding: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow® | Gestão Sem Frescura</title>
        <style>{`body { margin: 0; background: #000; overflow-x: hidden; }`}</style>
      </Head>

      {/* NAVBAR MINIMALISTA */}
      <nav style={{ padding: '30px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '-1px' }}>BARBERFLOW<span style={{color:'#ff7a00'}}>®</span></div>
        <button onClick={() => setShowModal(true)} style={{ background: 'none', border: '1px solid #333', color: '#fff', padding: '10px 20px', borderRadius: '5px', fontWeight: '700', cursor: 'pointer' }}>LOGIN</button>
      </nav>

      {/* HERO IMPACTANTE (ESTILO THINKS) */}
      <section style={{ padding: '100px 8% 60px', textAlign: 'left' }}>
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 90px)', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-4px', marginBottom: '30px' }}>
          GESTÃO <br/>DE ELITE. <br/><span style={{ color: '#ff7a00' }}>SEM ESPERA.</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#888', maxWidth: '500px', marginBottom: '40px', fontWeight: '500' }}>
          O sistema de agendamento e fila digital que coloca sua barbearia no topo. Simples, preto e laranja.
        </p>
        <button 
          onClick={() => setShowModal(true)} 
          style={{ backgroundColor: '#ff7a00', color: '#000', padding: '25px 50px', borderRadius: '4px', border: 'none', fontWeight: '900', fontSize: '20px', cursor: 'pointer', textTransform: 'uppercase' }}
        >
          TESTAR GRÁTIS
        </button>
      </section>

      {/* SEÇÃO DE PROVA SOCIAL RÁPIDA */}
      <section style={{ padding: '40px 8%', borderTop: '1px solid #111', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div><span style={{color: '#ff7a00', fontWeight: '900'}}>+500</span> Barbearias</div>
        <div><span style={{color: '#ff7a00', fontWeight: '900'}}>100%</span> Online</div>
        <div><span style={{color: '#ff7a00', fontWeight: '900'}}>Suporte</span> Humano</div>
      </section>

      {/* MODAL DE CADASTRO ESTILO THINKS (DIRETO AO PONTO) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
            {!loading ? (
              <>
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ color: '#ff7a00', fontWeight: '900', marginBottom: '10px' }}>PASSO {step} DE 2</div>
                  <h2 style={{ fontSize: '40px', fontWeight: '900', margin: 0, lineHeight: '1' }}>
                    {step === 1 ? "QUEM É VOCÊ?" : "E SEU NEGÓCIO?"}
                  </h2>
                </div>

                {step === 1 ? (
                  <div>
                    <input placeholder="SEU NOME" style={inputThinks} />
                    <input placeholder="SEU WHATSAPP" style={inputThinks} />
                    <button onClick={() => setStep(2)} style={btnThinks}>PRÓXIMO</button>
                  </div>
                ) : (
                  <div>
                    <input placeholder="NOME DA BARBEARIA" style={inputThinks} />
                    <button onClick={irParaWhats} style={btnThinks}>FINALIZAR E ATIVAR</button>
                  </div>
                )}
                <p onClick={() => setShowModal(false)} style={{ color: '#444', cursor: 'pointer', marginTop: '20px', textAlign: 'center', fontWeight: '700' }}>CANCELAR</p>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>⏳</div>
                <h2 style={{ fontWeight: '900', fontSize: '30px' }}>RÁPIDO COMO UM GATO...</h2>
                <p style={{ color: '#888' }}>Estamos te levando para o suporte oficial para ativar seu painel.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: '100px 8% 40px', color: '#222' }}>
        <div style={{ fontWeight: '900', fontSize: '14px' }}>BARBERFLOW ® 2026</div>
      </footer>
    </div>
  )
}

// Estilos Thinks
const inputThinks = {
  width: '100%',
  backgroundColor: '#000',
  border: 'none',
  borderBottom: '2px solid #222',
  padding: '20px 0',
  color: '#fff',
  fontSize: '24px',
  fontWeight: '700',
  outline: 'none',
  marginBottom: '20px',
  borderRadius: '0'
}

const btnThinks = {
  width: '100%',
  backgroundColor: '#ff7a00',
  color: '#000',
  padding: '25px',
  border: 'none',
  fontWeight: '900',
  fontSize: '18px',
  cursor: 'pointer',
  marginTop: '20px',
  borderRadius: '4px'
}
