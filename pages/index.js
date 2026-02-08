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
    const senha = prompt("Acesso Administrativo:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  // Links de alta disponibilidade que NÃO quebram (Substitua pelas suas artes finais)
  const cardsNetflix = [
    { url: "https://picsum.photos/id/1027/600/800", titulo: "A Tesoura fala!" },
    { url: "https://picsum.photos/id/331/600/800", titulo: "Cadeira Inteligente" },
    { url: "https://picsum.photos/id/454/600/800", titulo: "O Espelho avisa" },
    { url: "https://picsum.photos/id/161/600/800", titulo: "Máquina Veloz" }
  ]

  if (verTermos) {
    return (
      <div style={{ padding: '50px 8%', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#fff' }}>
        <h1 style={{ fontWeight: '900', color: '#00a88f' }}>Termos de Uso BarberFlow ®</h1>
        <p style={{ color: '#64748b', lineHeight: '1.8' }}>
          Este sistema é uma ferramenta de auxílio à gestão. Os dados coletados são temporários e destinados apenas à organização da fila local. <br/><br/>
          <strong>1. Uso de Dados:</strong> O nome inserido é público para todos os usuários da fila.<br/>
          <strong>2. Responsabilidade:</strong> Não nos responsabilizamos por perdas de conexão ou exclusões indevidas.<br/>
          <strong>3. Direitos:</strong> BarberFlow é uma marca registrada ®.
        </p>
        <button onClick={() => setVerTermos(false)} style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '10px', fontWeight: '900', marginTop: '30px' }}>VOLTAR AO INÍCIO</button>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Gestão</title>
        <style>{`
          .row-netflix { display: flex; overflow-x: auto; gap: 15px; padding: 20px 0; scrollbar-width: none; }
          .row-netflix::-webkit-scrollbar { display: none; }
          .card-netflix { 
            min-width: 240px; height: 320px; border-radius: 15px; 
            background-size: cover; background-position: center; 
            display: flex; align-items: flex-end; padding: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          }
          .card-overlay { background: rgba(0,0,0,0.5); width: 100%; padding: 10px; border-radius: 10px; color: #fff; font-weight: 700; font-size: 14px; text-align: center; }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontWeight: '900', fontSize: '20px', color: '#00a88f' }}>BarberFlow ®</span>
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '900' }}>ENTRAR</button>
      </nav>

      {/* FILA */}
      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '40px', letterSpacing: '-2px' }}>Fila em Tempo Real</h1>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', border: '2px solid #f1f5f9', borderRadius: '25px', padding: '30px' }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '15px', fontWeight: '700', boxSizing: 'border-box' }} />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#00a88f', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>ADICIONAR</button>
          
          <div style={{ marginTop: '25px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '800' }}>{i + 1}º {c.nome_cliente}</span>
                <button onClick={() => remover(c.id)} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: '900' }}>OK</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARROSSEL ESTILO NETFLIX */}
      <section style={{ padding: '20px 0 60px 8%' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px' }}>Conheça o Sistema</h2>
        <div className="row-netflix">
          {cardsNetflix.map((card, index) => (
            <div key={index} className="card-netflix" style={{ backgroundImage: `url(${card.url})` }}>
              <div className="card-overlay">{card.titulo}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 8%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <a href="https://wa.me/5500000000000" style={{ backgroundColor: '#25d366', color: '#fff', textDecoration: 'none', padding: '20px 40px', borderRadius: '50px', fontWeight: '900', fontSize: '18px', display: 'inline-block', marginBottom: '40px' }}>
          FALAR COM CONSULTOR
        </a>
        <br/>
        <button onClick={() => setVerTermos(true)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>TERMOS DE USO</button>
        <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '20px' }}>BarberFlow ® 2026 | Desenvolvido por O Criador</p>
      </footer>
    </div>
  )
}
