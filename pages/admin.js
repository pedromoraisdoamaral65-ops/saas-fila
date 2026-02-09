import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// CONFIGURAÇÃO COM SEUS DADOS REAIS
const supabase = createClient(
  'https://ucghxvsaouiribuhjkqz.supabase.co',
  'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r'
)

export default function AdminPage() {
  const [step, setStep] = useState(1) // 1: Cadastro, 2: Lista
  const [loading, setLoading] = useState(false)
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({
    cliente: '', servico: 'Corte', valor: 50, comissao_valor: 25
  })

  // Função para buscar dados do banco
  const buscarDados = async () => {
    const { data } = await supabase.from('agendamentos').select('*')
    if (data) setLista(data
  }

  const finalizar = async () => {
    setLoading(true)
    // Salvando na tabela que você criou
    const { error } = await supabase.from('agendamentos').insert([form])
    
    if (error) {
        alert('Erro: ' + error.message)
        setLoading(false)
    } else {
        await buscarDados()
        setTimeout(() => {
          setLoading(false)
          setStep(2) // Muda para a tela da lista em vez do WhatsApp
        }, 2000)
    }
  }

  // TELA DE CARREGAMENTO (O GATINHO)
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '50px' }}>🐱</h1>
      <h2 style={{ fontWeight: '900' }}>Será rápido como um gato!</h2>
      <p>Salvando informações no banco de dados...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
      
      {/* PASSO 1: CADASTRO */}
      {step === 1 && (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontWeight: '900', textAlign: 'center' }}>Novo Agendamento</h1>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>NOME DO CLIENTE</label>
          <input style={inputStyle} placeholder="Ex: Pedro Amaral" onChange={e => setForm({...form, cliente: e.target.value})} />
          
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>SERVIÇO</label>
          <select style={inputStyle} onChange={e => setForm({...form, servico: e.target.value})}>
            <option>Corte Degradê</option>
            <option>Barba</option>
            <option>Combo</option>
          </select>

          <button onClick={finalizar} style={btnStyle}>SALVAR NO SISTEMA</button>
        </div>
      )}

      {/* PASSO 2: PAINEL DE CONTROLE (O QUE VOCÊ QUERIA VER) */}
      {step === 2 && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontWeight: '900' }}>Painel da Barbearia</h1>
            <button onClick={() => setStep(1)} style={{ padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>+ Novo</button>
          </div>
          
          <div style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#eee', fontSize: '12px' }}>
                <tr>
                  <th style={{ padding: '15px' }}>CLIENTE</th>
                  <th>SERVIÇO</th>
                  <th>VALOR</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{item.cliente}</td>
                    <td>{item.servico}</td>
                    <td style={{ color: 'green' }}>R$ {item.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '15px', borderRadius: '50px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }
