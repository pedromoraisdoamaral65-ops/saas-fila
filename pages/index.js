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
        <title>BarberFlow | Gestão Inteligente</title>
        <style>{`body { margin: 0; padding: 0; }`}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="BarberFlow" style={{ height: '40px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold' }}>TESTE GRÁTIS</button>
      </nav>

      {/* HERO SECTION - CENTRALIZADA */}
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', maxWidth: '800px', margin: '0 auto 20px', lineHeight: '1.1' }}>
          Organize sua barbearia. <span style={{ color: '#00a88f' }}>Fidelize clientes.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '500px', margin: '0 auto 40px' }}>
          A maneira mais inteligente de gerir sua fila de espera e modernizar seu atendimento.
        </p>

        {/* COMPONENTE DA FILA (O PRODUTO) */}
        <div style={{ maxWidth: '450px', margin: '0 auto', background: '#fff', borderRadius: '28px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', textAlign: 'left' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Fila de Hoje</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do cliente" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }} />
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', borderRadius: '14px', padding: '0 20px', fontWeight: 'bold' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '700' }}><span style={{ color: '#00a88f' }}>{i + 1}º</span> {c.nome_cliente}</span>
                <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '11px' }}>CONCLUIR</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO EXPLICAÇÃO - COMO FUNCIONA */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '50px' }}>Como o BarberFlow funciona?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
          
          <div style={{ maxWidth: '300px', padding: '20px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', borderRadius: '20px', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Fila Digital</h3>
            <p style={{ color: '#64748b' }}>Clientes entram na fila escaneando um QR Code, sem precisar de papel.</p>
          </div>

          <div style={{ maxWidth: '300px', padding: '20px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', borderRadius: '20px', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Tempo Real</h3>
            <p style={{ color: '#64748b' }}>O barbeiro e o cliente acompanham o status da fila em tempo real.</p>
          </div>

          <div style={{ maxWidth: '300px', padding: '20px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1599351431247-f57933842922?auto=format&fit=crop&w=300&q=80" style={{ width: '100%', borderRadius: '20px', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Notificações</h3>
            <p style={{ color: '#64748b' }}>Seu cliente sabe exatamente quando será a vez dele.</p>
          </div>

        </div>
      </section>

      {/* FOOTER - CTA FINAL */}
      <footer style={{ padding: '100px 20px', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px' }}>Pronto para escalar seu negócio?</h2>
        <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Clique no botão abaixo e fale com um consultor BarberFlow.</p>
        <a href="https://wa.me/5500000000000" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '20px 50px', borderRadius: '50px', fontWeight: 'bold', fontSize: '18px', display: 'inline-block', boxShadow: '0 10px 20px rgba(0,168,143,0.3)' }}>
          COMEÇAR AGORA
        </a>
        <div style={{ marginTop: '80px', color: '#475569', fontSize: '13px' }}>
          © 2024 BarberFlow. Desenvolvido para Barbeiros de Elite.
        </div>
      </footer>
    </div>
  )
}
