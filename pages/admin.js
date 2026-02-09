import React from 'react'

export default function LandingPage() {
  const entrarNoSistema = () => {
    window.location.href = '/admin'
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center', padding: '50px 20px' }}>
      
      <h2 style={{ color: '#007bff', fontWeight: '900', marginBottom: '40px' }}>BARBERFLOW</h2>
      
      <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px' }}>
        A fila da sua barbearia, agora digital.
      </h1>
      
      <p style={{ color: '#ccc', marginBottom: '40px', fontSize: '18px' }}>
        Chega de confusão e papel. Gerencie seus atendimentos de forma profissional.
      </p>

      <button 
        onClick={entrarNoSistema} 
        style={{ 
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '20px 40px', 
          borderRadius: '50px', 
          border: 'none', 
          fontSize: '18px', 
          fontWeight: 'bold',
          cursor: 'pointer' 
        }}
      >
        ACESSAR MEU PAINEL ›
      </button>

      <div style={{ marginTop: '60px', color: '#444', fontSize: '12px' }}>
        Clique acima para gerenciar seus clientes
      </div>
    </div>
  )
}
