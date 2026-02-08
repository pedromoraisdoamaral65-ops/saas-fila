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
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0, paddingBottom: '80px' }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Gestão Profissional</title>
      </Head>

      {/* BARRA DE CONTATO FIXA (SUBSTITUI O BOTÃO FLUTUANTE) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00a88f',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
      }}>
        <a 
          href="https://wa.me/5500000000000" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '900',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span>FALAR COM UM CONSULTOR NO WHATSAPP</span>
          <span style={{ fontSize: '20px' }}>→</span>
        </a>
      </div>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '40px' }} />
        <button style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '800', fontSize: '12px' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION */}
      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-2px' }}>
          O fluxo da sua <br/> <span style={{ color: '#00a88f' }}>barbearia sob controle.</span>
        </h1>
        
        {/* FILA DIGITAL */}
        <div style={{ 
          width: '100%', 
          maxWidth: '450px', 
          background: '#ffffff', 
          borderRadius: '30px', 
          padding: '30px', 
          margin: '40px auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)', 
          border: '1px solid #f1f5f9',
          textAlign: 'left' 
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>⚡ Fila Digital</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px', fontWeight: '700' }} />
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', padding: '15px', borderRadius: '12px', fontWeight: '900', border: 'none', fontSize: '16px' }}>ADICIONAR</button>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '15px', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '800' }}>{i + 1}º {c.nome_cliente}</span>
                <button onClick={() => remover(c.id)} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: '900' }}>OK</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO OBJETOS QUE FALAM (IMAGENS CORRIGIDAS) */}
      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '40px' }}>Um sistema completo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          
          <div>
            <img src="https://i.postimg.cc/mD7XF6rN/tesoura-fala.png" alt="Tesoura" style={{ width: '100%', borderRadius: '20px', marginBottom: '15px' }} />
            <h3 style={{ fontWeight: '900' }}>Fácil de usar</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Gestão intuitiva que economiza seu tempo.</p>
          </div>

          <div>
            <img src="https://i.postimg.cc/85zK20M8/cadeira-fala.png" alt="Cadeira" style={{ width: '100%', borderRadius: '20px', marginBottom: '15px' }} />
            <h3 style={{ fontWeight: '900' }}>Conforto total</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Melhore a experiência de espera do seu cliente.</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 8%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>TERMOS DE USO</span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>PRIVACIDADE</span>
        </div>
        <p style={{ fontWeight: '900', fontSize: '14px' }}>BarberFlow ® — Todos os direitos reservados.</p>
        <p style={{ color: '#94a3b8', fontSize: '12px' }}>Desenvolvido por O Criador</p>
      </footer>
    </div>
  )
}
