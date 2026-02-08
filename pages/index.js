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
  const [aba, setAba] = useState('home') // Controle para Termos de Uso

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
    const senha = prompt("Acesso BarberFlow:")
    if (senha === '1234') { 
      await supabase.from('fila').delete().eq('id', id)
      carregarFila()
    }
  }

  // Links estáveis de objetos falantes para o Carrossel Netflix
  const objetosTikTok = [
    { url: "https://i.postimg.cc/mD7XF6rN/tesoura-fala.png", titulo: "Tesoura Comunicativa" },
    { url: "https://i.postimg.cc/85zK20M8/cadeira-fala.png", titulo: "Cadeira Inteligente" },
    { url: "https://i.postimg.cc/mD7XF6rN/tesoura-fala.png", titulo: "Máquina Veloz" },
    { url: "https://i.postimg.cc/85zK20M8/cadeira-fala.png", titulo: "Espelho Amigo" }
  ]

  if (aba === 'termos') {
    return (
      <div style={{ padding: '60px 8%', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
        <button onClick={() => setAba('home')} style={{ marginBottom: '30px', fontWeight: '900', border: 'none', background: '#00a88f', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>← VOLTAR</button>
        <h1 style={{ fontWeight: '900' }}>Termos de Uso ®</h1>
        <p style={{ lineHeight: '1.6', color: '#64748b' }}>
          1. <strong>Serviço:</strong> O BarberFlow é uma ferramenta de gestão de filas em tempo real.<br/>
          2. <strong>Privacidade:</strong> Não armazenamos dados sensíveis, apenas nomes para a fila.<br/>
          3. <strong>Responsabilidade:</strong> O uso da senha de exclusão é de inteira responsabilidade do estabelecimento.<br/>
          4. <strong>Propriedade:</strong> Todo o design e mecânica são protegidos por direitos autorais.
        </p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif", color: '#0f172a', margin: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Gestão Inteligente</title>
        <style>{`
          .netflix-container { display: flex; overflow-x: auto; gap: 20px; padding: 20px 0; scrollbar-width: none; }
          .netflix-container::-webkit-scrollbar { display: none; }
          .netflix-item { 
            min-width: 260px; height: 350px; border-radius: 20px; 
            background-size: cover; background-position: center; 
            transition: 0.4s; border: 2px solid #f1f5f9;
          }
          .netflix-item:hover { transform: scale(1.03); border-color: #00a88f; }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '20px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <img src="https://i.ibb.co/KxJr4TyP/file-000000001e94720ead1f91dfe8d64505.png" alt="Logo" style={{ height: '40px' }} />
        <button style={{ backgroundColor: '#00a88f', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: '900' }}>TESTE GRÁTIS</button>
      </nav>

      {/* FILA DIGITAL CENTRALIZADA */}
      <section style={{ padding: '60px 8%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '40px' }}>O fluxo está <span style={{ color: '#00a88f' }}>vivo.</span></h1>
        
        <div style={{ maxWidth: '450px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '30px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do cliente..." style={{ width: '100%', padding: '18px', borderRadius: '12px', border: '2px solid #f1f5f9', marginBottom: '15px', fontWeight: '700', boxSizing: 'border-box' }} />
          <button onClick={add} style={{ width: '100%', backgroundColor: '#0f172a', color: '#fff', padding: '18px', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>ADICIONAR À FILA</button>
          
          <div style={{ marginTop: '30px' }}>
            {fila.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '15px', marginBottom: '10px' }}>
                <span style={{ fontWeight: '800' }}>{i + 1}º {c.nome_cliente}</span>
                <button onClick={() => remover(c.id)} style={{ color: '#00a88f', background: 'none', border: 'none', fontWeight: '900' }}>OK</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MECÂNICA NETFLIX COM OBJETOS FALANTES */}
      <section style={{ padding: '40px 0 60px 8%' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '20px' }}>Conheça o Sistema ®</h2>
        <div className="netflix-container">
          {objetosTikTok.map((obj, idx) => (
            <div key={idx} className="netflix-item" style={{ backgroundImage: `url(${obj.url})` }}>
              <div style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', height: '100%', borderRadius: '20px', display: 'flex', alignItems: 'bottom', padding: '20px' }}>
                <p style={{ color: '#fff', fontWeight: '900', marginTop: 'auto' }}>{obj.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER COM TERMOS */}
      <footer style={{ padding: '60px 8%', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
        <a href="https://wa.me/5500000000000" style={{ backgroundColor: '#00a88f', color: '#fff', textDecoration: 'none', padding: '20px 40px', borderRadius: '100px', fontWeight: '900', fontSize: '18px', display: 'inline-block', marginBottom: '40px' }}>
          CHAMAR NO WHATSAPP
        </a>
        <br/>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button onClick={() => setAba('termos')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>TERMOS DE USO</button>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>|</span>
          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>BARBERFLOW ® 2026</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '20px' }}>Desenvolvido por O Criador</p>
      </footer>
    </div>
  )
}
