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
    const senha = prompt("Acesso restrito. Digite a senha:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", color: '#1a1a1a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
        <title>Barber Green | Gestão Inteligente</title>
        <style>{`body { margin: 0; padding: 0; }`}</style>
      </Head>

      {/* Navbar Profissional */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: '800', fontSize: '22px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌿</span> BARBER<span style={{color: '#1a1a1a'}}>PRO</span>
        </div>
        <button style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
          LOGAR
        </button>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#064e3b', marginBottom: '15px', lineHeight: '1.2' }}>
          O sistema de fila mais <span style={{color: '#10b981'}}>rápido</span> para sua barbearia
        </h1>
        <p style={{ color: '#4b5563', fontSize: '16px', maxWidth: '400px', margin: '0 auto 30px' }}>
          Aumente sua produtividade e ofereça uma experiência VIP para seus clientes.
        </p>
        
        {/* Container da Fila */}
        <div style={{ 
          maxWidth: '450px', 
          margin: '0 auto', 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '25px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          textAlign: 'left',
          border: '1px solid #f0f0f0'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#064e3b' }}>Fila de Atendimento</h2>
          
          {/* Adicionar Cliente */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <input 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              placeholder="Nome do cliente" 
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '16px', outline: 'none', backgroundColor: '#f9fafb' }}
            />
            <button onClick={add} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
              Add
            </button>
          </div>

          {/* Listagem de Clientes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fila.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Nenhum cliente na espera...</p>}
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '14px', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '28px', height: '28px', backgroundColor: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{c.nome_cliente}</span>
                </div>
                <button 
                  onClick={() => remover(c.id)} 
                  style={{ color: '#059669', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.5px' }}
                >
                  CONCLUÍDO
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '25px' }}>Transforme seu atendimento hoje mesmo</h3>
        <a 
          href="https://wa.me/5500000000000" 
          style={{ textDecoration: 'none', backgroundColor: '#10b981', color: '#fff', padding: '16px 35px', borderRadius: '50px', fontWeight: 'bold', display: 'inline-block', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
        >
          QUERO ESTE SISTEMA
        </a>
      </section>
    </div>
  )
}
