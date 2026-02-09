import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// CONFIGURAÇÃO COM SEUS DADOS REAIS DO SUPABASE
const supabase = createClient(
  'https://ucghxvsaouiribuhjkqz.supabase.co',
  'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r'
)

export default function AdminPage() {
  const [step, setStep] = useState(1) // 1: Formulário, 2: Lista de Clientes
  const [loading, setLoading] = useState(false)
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({
    cliente: '', 
    servico: 'Corte', 
    valor: 50, 
    comissao_valor: 25
  })

  // Função para buscar os agendamentos do banco de dados
  const buscarDados = async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setLista(data)
  }

  // Carregar a lista automaticamente quando entrar na tela 2
  useEffect(() => {
    if (step === 2) buscarDados()
  }, [step])

  const finalizar = async () => {
    if (!form.cliente) return alert('Por favor, digite o nome do cliente.')
    
    setLoading(true)
    
    // Salvando na tabela 'agendamentos' que você criou no SQL Editor
    const { error } = await supabase
      .from('agendamentos')
      .insert([form])
    
    if (error) {
        alert('Erro ao salvar no banco: ' + error.message)
        setLoading(false)
    } else {
        // Sucesso: Espera o gatinho e mostra a lista
        setTimeout(() => {
          setLoading(false)
          setStep(2) 
        }, 2000)
    }
  }

  // TELA DO GATINHO (LOADING)
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '50px' }}>🐱</h1>
      <h2 style={{ fontWeight: '900' }}>Salvando no sistema...</h2>
      <p>Será rápido como um gato!</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
      
      {/* TELA 1: CADASTRO DE CLIENTE */}
      {step === 1 && (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontWeight: '900', textAlign: 'center', marginBottom: '30px' }}>BarberFlow Admin</h1>
          
          <label style={labelStyle}>NOME DO CLIENTE</label>
          <input 
            style={inputStyle} 
            placeholder="Ex: Pedro Amaral" 
            onChange={e => setForm({...form, cliente: e.target.value})} 
          />
          
          <label style={labelStyle}>SERVIÇO</label>
          <select style={inputStyle} onChange={e => setForm({...form, servico: e.target.value})}>
            <option value="Corte">Corte Degradê</option>
            <option value="Barba">Barba</option>
            <option value="Combo">Combo Completo</option>
          </select>

          <button onClick={finalizar} style={btnStyle}>SALVAR AGENDAMENTO</button>
          
          <button 
            onClick={() => setStep(2)} 
            style={{ ...btnStyle, backgroundColor: '#666', marginTop: '10px' }}>
            VER LISTA DE CLIENTES
          </button>
        </div>
      )}

      {/* TELA 2: PAINEL DE GESTÃO (LISTA) */}
      {step === 2 && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontWeight: '900' }}>Meus Clientes</h1>
            <button onClick={() => setStep(1)} style={smallBtnStyle}>+ Novo</button>
          </div>
          
          <div style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f8f8', fontSize: '12px' }}>
                <tr>
                  <th style={tdStyle}>CLIENTE</th>
                  <th style={tdStyle}>SERVIÇO</th>
                  <th style={tdStyle}>VALOR</th>
                </tr>
              </thead>
              <tbody>
                {lista.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Nenhum cliente cadastrado ainda.</td></tr>
                ) : (
                  lista.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={tdStyle}><strong>{item.cliente}</strong></td>
                      <td style={tdStyle}>{item.servico}</td>
                      <td style={{ ...tdStyle, color: 'green' }}>R$ {item.valor}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ESTILOS PARA O CÓDIGO FICAR BONITO
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: 'bold', color: '#666' }
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '15px', borderRadius: '50px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }
const smallBtnStyle = { padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
const tdStyle = { padding: '15px', fontSize: '14px', textAlign: 'left' }
