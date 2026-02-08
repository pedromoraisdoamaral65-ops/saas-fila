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
  const [verTermos, setVerTermos] = useState(false)

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
    const senha = prompt("Acesso BarberFlow. Digite a senha:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  // Links de alta disponibilidade (Imagens que NÃO quebram)
  const netflixCards = [
    { url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600", titulo: "Tesoura: 'Vou deixar-te na régua!'" },
    { url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600", titulo: "Cadeira: 'Senta que o show vai começar!'" },
    { url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600", titulo: "Máquina: 'Zunindo para a perfeição!'" },
    { url: "https://images.unsplash.com/photo-1593702275677-f916c8c70ca4?w=600", titulo: "Navalha: 'Precisão é o meu nome!'" }
  ]

  if (verTermos) {
    return (
      <div style={{ padding: '60px 8%', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
        <h1 style={{ fontWeight: '900', color: '#00a88f', fontSize: '32px' }}>Termos de Uso e Condições ®</h1>
        <div style={{ color: '#64748b', lineHeight: '1.8', textAlign: 'left', maxWidth: '800px' }}>
          <p><strong>1. Aceitação dos Termos:</strong> Ao utilizar o BarberFlow, o estabelecimento e o cliente concordam com a organização digital por ordem de chegada.</p>
          <p><strong>2. Privacidade de Dados:</strong> O sistema solicita apenas o primeiro nome do cliente. Estes dados são temporários e serão eliminados assim que o serviço for marcado como "Concluído" pelo barbeiro.</p>
          <p><strong>3. Responsabilidade do Estabelecimento:</strong> A gestão da fila, o tempo de espera e a exclusão de nomes são de inteira responsabilidade do utilizador administrativo.</p>
          <p><strong>4. Uso da Marca:</strong> BarberFlow ® é uma tecnologia protegida. A reprodução do design ou código sem autorização é proibida.</p>
          <p><strong>5. Limitação de Serviço:</strong> O BarberFlow é uma ferramenta de auxílio à gestão e não garante ganhos financeiros diretos ou funcionamento ininterrupto em caso de falhas de internet local.</p>
        </div>
        <button onClick={() => setVerTermos(false)} style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '15px 40px', borderRadius: '12px', fontWeight: '900', marginTop: '40px', cursor: 'pointer' }}>VOLTAR AO SISTEMA</button>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Gestão Profissional</title>
        <style>{`
          .netflix-row { display: flex; overflow-x: auto; gap: 20px; padding: 20px 0; scrollbar-width: none; }
          .netflix-row::-webkit-scrollbar { display: none; }
          .netflix-card { 
            min-width: 280px; height: 380px; border-radius: 25px; 
            background-size: cover; background-position: center; 
            display: flex; align-items: flex-end; padding: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1); transition: 0.3s;
          }
          .netflix-card:hover { transform: translateY(-10px); }
          .card-text { background: rgba(0,0,0,0.7); color: #fff; padding: 15px; border-radius: 15px; width: 100%; font-weight: 700; font-size: 14px; }
        `}</style>
      </Head>

      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontWeight: '900', fontSize: '22px', color: '#00a88f' }}>BarberFlow ®</span>
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: '900' }}>TESTE GRÁTIS</button>
      </nav>

      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '40px' }}>Fila Digital Interativa</h1>
        <div style={{ maxWidth: '450px', margin: '0 auto', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '35px', padding: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #f1f5f9', marginBottom: '15px', fontWeight: '700', boxSizing: 'border-box' }} />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>ADICIONAR À FILA</button>
          
          <div style={{ marginTop: '30px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '18px', marginBottom: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '800' }}>{i + 1}º {c.nome_cliente}</span>
                <button onClick={() => remover(c.id)} style={{ color: '#00a88f', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer' }}>CONCLUIR</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '20px 0 80px 8%' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Conheça o Sistema ®</h2>
        <div className="netflix-row">
          {netflixCards.map((card
