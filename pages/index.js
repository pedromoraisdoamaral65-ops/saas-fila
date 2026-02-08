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
  
  // Estados do Fluxo de Cadastro
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(1)
  const [loadingFinal, setLoadingFinal] = useState(false)

  async function carregarFila() {
    const { data } = await supabase.from('fila').select('*').order('id')
    setFila(data || [])
  }

  useEffect(() => { carregarFila() }, [])

  const abrirCadastro = () => { setStep(1); setShowModal(true); }

  const finalizarCadastro = () => {
    setLoadingFinal(true)
    setTimeout(() => {
      const msg = encodeURIComponent("Olá! Acabei de me cadastrar no BarberFlow e gostaria de ativar minha unidade.")
      window.location.href = `https://wa.me/5599999999999?text=${msg}`
    }, 3000)
  }

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#ffffff', margin: 0, padding: 0 }}>
      <Head>
        <title>BarberFlow ® | Gestão Elite</title>
        <style>{`body { margin: 0; background: #000; overflow-x: hidden; }`}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
        <div style={{ fontWeight: '900', fontSize: '22px', color: '#ff7a00' }}>BarberFlow®</div>
        <button onClick={abrirCadastro} style={{ backgroundColor: '#ff7a00', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>TESTAR GRÁTIS</button>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 5%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px' }}>
          Agendamento online com <br/><span style={{ color: '#ff7a00' }}>gestão completa</span>
        </h1>
        <p style={{ color: '#aaa', marginBottom: '40px' }}>Tenha controle da agenda e financeiro com um sistema simples.</p>
        
        <button onClick={abrirCadastro} style={{ backgroundColor: '#ff7a00', color: '#000', padding: '20px 40px', borderRadius: '12px', border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
          TESTAR GRÁTIS
        </button>
      </section>

      {/* MODAL DE CADASTRO (FLUXO DAS IMAGENS) */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', color: '#000', width: '100%', maxWidth: '450px', borderRadius: '24px', padding: '40px', position: 'relative', textAlign: 'center' }}>
            {!loadingFinal ? (
              <>
                {step === 1 && (
                  <div>
                    <h2 style={{fontSize: '28px', fontWeight: '800'}}>Olá, vamos começar?</h2>
                    <p style={{color: '#666', marginBottom: '30px'}}>Nos fale sobre você</p>
                    <input placeholder="Qual é o seu nome?" style={inputStyle} />
                    <input placeholder="Qual é o seu WhatsApp?" style={inputStyle} />
                    <button onClick={() => setStep(2)} style={btnNext}>Próximo</button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 style={{fontSize: '28px', fontWeight: '800'}}>Perfeito!</h2>
                    <p style={{color: '#666', marginBottom: '30px'}}>Agora, nos conte sobre seu negócio</p>
                    <input placeholder="Nome do seu negócio" style={inputStyle} />
                    <select style={inputStyle}>
                      <option>Salão de Beleza</option>
                      <option>Barbearia</option>
                    </select>
                    <button onClick={() => setStep(3)} style={btnNext}>Próximo</button>
                    <p onClick={() => setStep(1)} style={{cursor: 'pointer', marginTop: '15px', color: '#666'}}>Voltar</p>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 style={{fontSize: '28px', fontWeight: '800'}}>Ótimo!</h2>
                    <p style={{color: '#666', marginBottom: '30px'}}>Informe seus dados de acesso</p>
                    <input placeholder="Seu e-mail" style={inputStyle} />
                    <input type="password" placeholder="Escolha uma senha" style={inputStyle} />
                    <button onClick={finalizarCadastro} style={btnNext}>Cadastrar</button>
                  </div>
                )}
              </>
            ) : (
              <div style={{padding: '40px 0'}}>
                <div style={{fontSize: '60px', marginBottom: '20px'}}>🐱</div>
                <h3 style={{fontWeight: '800'}}>Por favor aguarde.</h3>
                <p>Estamos preparando a sua agenda.<br/>Será rápido como um gato!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '12px', fontSize: '16px', outline: 'none' }
const btnNext = { width: '100%', backgroundColor: '#7b2cbf', color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }
