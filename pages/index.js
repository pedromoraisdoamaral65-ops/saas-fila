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
          body { margin: 0; padding: 0; overflow-x: hidden; }
          @media (max-width: 900px) {
            .hero-container { flex-direction: column !important; text-align: center !important; padding: 40px 20px !important; }
            .hero-text { text-align: center !important; margin-bottom: 40px !important; }
            .hero-title { font-size: 32px !important; }
            .hero-image-col { width: 100% !important; }
          }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '15px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '45px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold' }}>TESTE GRÁTIS</button>
      </nav>

      {/* SEÇÃO HERO - DUAS COLUNAS */}
      <section style={{ 
        padding: '80px 8%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
        gap: '40px'
      }} className="hero-container">
        
        <div style={{ flex: 1, textAlign: 'left' }} className="hero-text">
          <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', color: '#0f172a', marginBottom: '25px' }} className="hero-title">
            O sistema de gestão que sua <span style={{ color: '#00a88f' }}>barbearia merece</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '35px', maxWidth: '500px' }}>
            Controle sua fila em tempo real, reduza atrasos e modernize o seu atendimento com a BarberFlow.
          </p>
          <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '18px 40px', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,168,143,0.3)' }}>
            COMEÇAR AGORA
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }} className="hero-image-col">
          <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '30px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Fila Online 🟢</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }} />
              <button onClick={add} style={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '14px', padding: '0 15px', fontWeight: 'bold' }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fila.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontWeight: '700' }}>{i + 1}º {c.nome_cliente}</span>
                  <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '11px' }}>OK</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO EXPLICAÇÃO COM AS NOVAS IMAGENS */}
      <section style={{ padding: '80px 8%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '60px' }}>Como facilitamos sua vida:</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          <div style={{ padding: '20px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=500&q=80" alt="Gestão" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Controle Mobile</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Gerencie sua fila de qualquer lugar, direto pelo celular do barbeiro.</p>
          </div>

          <div style={{ padding: '20px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80" alt="Ambiente" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Fila em Tempo Real</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Seus clientes sabem exatamente quanto tempo falta para serem atendidos.</p>
          </div>

          <div style={{ padding: '20px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1593702275677-f916c8c70ca4?auto=format&fit=crop&w=500&q=80" alt="Corte" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Fidelização</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Ofereça uma experiência moderna e faça seu cliente querer voltar sempre.</p>
          </div>

        </div>
      </section>

      {/* FOOTER CTA */}
      <footer style={{ padding: '80px 8%', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '20px' }}>Pronto para o BarberFlow?</h2>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '18px 45px', borderRadius: '50px', fontWeight: 'bold', display: 'inline-block' }}>
          FALAR COM CONSULTOR
        </a>
        <p style={{ marginTop: '50px', fontSize: '11px', color: '#475569' }}>© 2024 BarberFlow. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
