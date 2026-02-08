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
        <title>BarberFlow ® | Gestão Elite</title>
      </Head>

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a 
        href="https://wa.me/5500000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25d366',
          color: '#fff',
          width: '60px',
          height: '60px',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          textDecoration: 'none'
        }}
      >
        <span style={{ marginBottom: '5px' }}>💬</span>
      </a>

      {/* NAVBAR CLEAN */}
      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '40px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: '900', fontSize: '13px' }}>TESTE GRÁTIS</button>
      </nav>

      {/* SEÇÃO HERO - TUDO BRANCO */}
      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-2px' }}>
          Domine o <span style={{ color: '#00a88f' }}>Fluxo</span> da sua Barbearia.
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '50px', fontWeight: '500' }}>
          Organização premium com tecnologia de ponta.
        </p>

        {/* COMPONENTE DA FILA */}
        <div style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: '#ffffff', 
          borderRadius: '35px', 
          padding: '40px', 
          margin: '0 auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)', 
          border: '2px solid #f1f5f9',
          textAlign: 'left' 
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '25px' }}>⚡ Fila Digital</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ padding: '18px', borderRadius: '15px', border: '2px solid #f1f5f9', fontSize: '16px', fontWeight: '700', outline: 'none' }} />
            <select onChange={e => setServico(e.target.value)} style={{ padding: '18px', borderRadius: '15px', border: '2px solid #f1f5f9', fontSize: '16px', fontWeight: '700', backgroundColor: '#f8fafc', outline: 'none' }}>
              <option>Corte</option>
              <option>Barba</option>
              <option>Completo</option>
            </select>
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', border: 'none', fontSize: '16px', cursor: 'pointer' }}>ENTRAR NA FILA</button>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '18px' }}>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '16px' }}>{i + 1}º {c.nome_cliente}</div>
                  <div style={{ color: '#00a88f', fontWeight: '700', fontSize: '12px' }}>{c.servico}</div>
                </div>
                <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '900' }}>OK</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO "UM SISTEMA COMPLETO" COM OBJETOS QUE FALAM */}
      <section style={{ padding: '80px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '38px', fontWeight: '900', marginBottom: '60px' }}>Um sistema completo</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* OBJETO 1: TESOURA */}
          <div style={{ textAlign: 'center' }}>
            <img src="https://i.ibb.co/60qXj1w8/file-0000000010c73e045f94d3ec37c35845.png" alt="Tesoura falando" style={{ width: '100%', borderRadius: '30px', marginBottom: '20px' }} />
            <h3 style={{ fontWeight: '900', fontSize: '20px' }}>Fácil de usar</h3>
            <p style={{ color: '#64748b' }}>Até seus equipamentos vão amar a organização.</p>
          </div>

          {/* OBJETO 2: CADEIRA */}
          <div style={{ textAlign: 'center' }}>
            <img src="https://i.ibb.co/FLzQWqN4/file-000000003023e387f62e8da0409a8594.png" alt="Cadeira falando" style={{ width: '100%', borderRadius: '30px', marginBottom: '20px' }} />
            <h3 style={{ fontWeight: '900', fontSize: '20px' }}>Conforto total</h3>
            <p style={{ color: '#64748b' }}>Seu cliente sabe quando sentar e quando esperar.</p>
          </div>

        </div>
      </section>

      {/* FOOTER FINAL */}
      <footer style={{ padding: '60px 8%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <p style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>
          BarberFlow ® — Todos os direitos reservados.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px' }}>
          Desenvolvido por <strong>O Criador</strong>.
        </p>
      </footer>
    </div>
  )
        }
                      
