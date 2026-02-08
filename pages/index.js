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
        <title>BarberFlow | Gestão de Fluxo Profissional</title>
        <style>{`body { margin: 0; padding: 0; }`}</style>
      </Head>

      {/* NAVBAR COM SUA LOGO */}
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 1000 }}>
        <img 
          src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" 
          alt="BarberFlow Logo" 
          style={{ height: '45px', width: 'auto' }} 
        />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
          TESTE GRÁTIS
        </button>
      </nav>

      {/* SEÇÃO PRINCIPAL - LANDING PAGE */}
      <div style={{ padding: '60px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', color: '#0f172a', marginBottom: '20px' }}>
          O fluxo da sua barbearia em <span style={{ color: '#00a88f' }}>outro nível</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '400px', margin: '0 auto 40px' }}>
          Abandone o papel. Organize sua fila e fidelize clientes com o BarberFlow.
        </p>

        {/* COMPONENTE DA FILA (O SEU PRODUTO) */}
        <div style={{ 
          maxWidth: '450px', 
          margin: '0 auto', 
          background: '#ffffff', 
          borderRadius: '28px', 
          padding: '25px', 
          boxShadow: '0 20px 40px rgba(0, 168, 143, 0.1)',
          border: '1px solid #f1f5f9',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#1e293b' }}>Fila de Hoje</h2>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '25px' }}>
            <input 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              placeholder="Nome do cliente" 
              style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '16px' }}
            />
            <button onClick={add} style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', borderRadius: '14px', padding: '0 20px', fontWeight: 'bold' }}>Add</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fila.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>Fila livre agora!</p>
            ) : (
              fila.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px' }}>
                    <span style={{ color: '#00a88f', marginRight: '8px' }}>{i + 1}º</span> {c.nome_cliente}
                  </span>
                  <button onClick={() => remover(c.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>CONCLUIR</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* FOOTER DE VENDAS */}
      <footer style={{ padding: '60px 20px', backgroundColor: '#0f172a', color: '#fff', textAlign: 'center' }}>
        <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Escalabilidade para sua Barber</h3>
        <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Tecnologia de ponta para quem busca excelência.</p>
        <a href="https://wa.me/5511999999999" style={{ textDecoration: 'none', backgroundColor: '#00a88f', color: '#fff', padding: '15px 35px', borderRadius: '50px', fontWeight: 'bold', display: 'inline-block' }}>
          CHAMAR NO WHATSAPP
        </a>
        <p style={{ marginTop: '40px', fontSize: '11px', color: '#475569' }}>© 2024 BarberFlow. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
