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
        <title>BarberFlow ® | Gestão Profissional</title>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '25px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '45px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>TESTE GRÁTIS</button>
      </nav>

      {/* SEÇÃO PRINCIPAL (HERO) - SEM O FUNDO BRANCO SEPARADO */}
      <section style={{ 
        padding: '80px 8%', 
        textAlign: 'center', 
        background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-2px' }}>
          Domine o <span style={{ color: '#00a88f' }}>Fluxo</span> da sua Barbearia.
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '50px', maxWidth: '600px', fontWeight: '500' }}>
          Organização premium para barbeiros que não aceitam menos que o topo.
        </p>

        {/* CARD DA FILA CENTRALIZADO */}
        <div style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: '#ffffff', 
          borderRadius: '35px', 
          padding: '40px', 
          boxShadow: '0 30px 60px rgba(0, 168, 143, 0.1)', 
          border: '1px solid #f1f5f9',
          textAlign: 'left' 
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#00a88f' }}>●</span> Fila Online
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ padding: '18px', borderRadius: '15px', border: '2px solid #f1f5f9', fontSize: '16px', fontWeight: '700', outline: 'none' }} />
            <select onChange={e => setServico(e.target.value)} style={{ padding: '18px', borderRadius: '15px', border: '2px solid #f1f5f9', fontSize: '16px', fontWeight: '700', backgroundColor: '#f8fafc', outline: 'none' }}>
              <option>Corte de Cabelo</option>
              <option>Barba Completa</option>
              <option>Combo (Cabelo + Barba)</option>
            </select>
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', border: 'none', fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}>ADICIONAR À FILA</button>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fila.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Nenhum cliente na espera...</p>
            ) : (
              fila.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '900', fontSize: '16px' }}>{i + 1}º {c.nome_cliente}</div>
                    <div style={{ color: '#00a88f', fontWeight: '700', fontSize: '12px' }}>{c.servico || 'Corte'}</div>
                  </div>
                  <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>OK</button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO DE IMAGENS - FUNDO ESCURO PARA DESTAQUE */}
      <section style={{ padding: '80px 8%', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '50px' }}>Um sistema completo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600" alt="Barbeiro Profissional" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
          </div>
          <div style={{ borderRadius: '25px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600" alt="Equipamento" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* FOOTER - INFORMAÇÕES DO CRIADOR E REGISTRO */}
      <footer style={{ padding: '80px 8%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '20px 50px', borderRadius: '50px', fontWeight: '900', fontSize: '18px', display: 'inline-block', marginBottom: '60px' }}>
          FALAR NO WHATSAPP
        </a>
        
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '40px' }}>
          <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="Logo" style={{ height: '30px', opacity: 0.5, marginBottom: '20px' }} />
          <p style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b', marginBottom: '5px' }}>
            BarberFlow ® — Todos os direitos reservados.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '12px', maxWidth: '400px', margin: '0 auto' }}>
            Desenvolvido por <strong>[SEU NOME OU NOME DA SUA AGÊNCIA]</strong>. 
            Soluções inteligentes para negócios de alta performance.
          </p>
        </div>
      </footer>
    </div>
  )
}
