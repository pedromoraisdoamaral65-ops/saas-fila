import Head from 'head'

export default function LandingPage() {
  const irParaFila = () => {
    window.location.href = '/admin'
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Head>
        <title>BarberFlow | Fila Digital</title>
      </Head>

      {/* HEADER / LOGO */}
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: '900', color: '#007bff', margin: 0 }}>BARBERFLOW</h2>
        <button onClick={irParaFila} style={smallBtnStyle}>ENTRAR</button>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>
          Filas intermináveis agora são coisa do passado.
        </h1>
        <p style={{ color: '#ccc', fontSize: '18px', marginBottom: '40px' }}>
          Gestão inteligente para sua barbearia. Organize seus clientes em segundos e aumente sua produtividade.
        </p>

        <button onClick={irParaFila} style={mainBtnStyle}>
          QUERO ENTRAR NA FILA AGORA ›
        </button>

        {/* CARDS DE RECURSOS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '60px' }}>
          <div style={cardStyle}>
            <h3 style={{ color: '#007bff' }}>Fila Digital</h3>
            <p>Seu cliente agenda por QR Code ou link em segundos.</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ color: '#007bff' }}>Dashboard</h3>
            <p>Veja o lucro da sua barbearia em tempo real, onde estiver.</p>
          </div>
        </div>
      </main>

      <footer style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        © 2024 BarberFlow - O Futuro da sua Barbearia.
      </footer>
    </div>
  )
}

// ESTILOS BONITOS
const mainBtnStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '20px 30px',
  borderRadius: '50px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)'
}

const smallBtnStyle = {
  backgroundColor: 'transparent',
  color: '#fff',
  padding: '8px 20px',
  borderRadius: '50px',
  border: '1px solid #fff',
  fontWeight: 'bold',
  cursor: 'pointer'
}

const cardStyle = {
  backgroundColor: '#111',
  padding: '20px',
  borderRadius: '15px',
  textAlign: 'left',
  border: '1px solid #222'
}
