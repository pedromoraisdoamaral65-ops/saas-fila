import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// CONFIGURAÇÃO REAL DO SEU PROJETO
const supabase = createClient(
  'https://ucghxvsaouiribuhjkqz.supabase.co',
  'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r'
)

export default function AdminPage() {
  const [step, setStep] = useState(1) 
  const [loading, setLoading] = useState(false)
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({ cliente: '', servico: 'Corte', valor: 50 })

  // Busca os agendamentos salvos
  const buscarDados = async () => {
    const { data } = await supabase
      .from('agendamentos')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setLista(data)
  }

  // Carrega a lista sempre que mudar para a tela 2
  useEffect(() => { 
    if (step === 2) buscarDados() 
  }, [step])

  const finalizar = async () => {
    if (!form.cliente) return alert('Por favor, digite o nome do cliente')
    setLoading(true)
    
    // Salva na tabela agendamentos que você já criou
    const { error } = await supabase.from('agendamentos').insert([form])
    
    if (error) {
        alert('Erro ao salvar: ' + error.message)
        setLoading(false)
    } else {
        // Redireciona para a lista interna, sem sair do site
        setTimeout(() => {
          setLoading(false)
          setStep(2) 
        }, 2000)
    }
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '50px' }}>🐱</h1>
      <h2 style={{ fontWeight: '900' }}>Salvando no sistema...</h2>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
      {step === 1 ? (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', fontWeight: '900' }}>BarberFlow Admin</h1>
          
          <label style={labelStyle}>NOME DO CLIENTE</label>
          <input style={inputStyle} placeholder="Ex: Pedro Amaral" onChange={e => setForm({...form, cliente: e.target.value})} />
          
          <label style={labelStyle}>SERVIÇO</label>
          <select style={inputStyle} onChange={e => setForm({...form, servico: e.target.value})}>
            <option>Corte</option>
            <option>Barba</option>
            <option>Combo</option>
          </select>

          <button onClick={finalizar} style={btnStyle}>SALVAR AGENDAMENTO</button>
          <button onClick={() => setStep(2)} style={{ ...btnStyle, backgroundColor: '#666', marginTop: '10px' }}>VER LISTA DE HOJE</button>
        </div>
      ) : (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontWeight: '900' }}>Lista de Clientes</h1>
            <button onClick={() => setStep(1)} style={smallBtnStyle}>+ Novo</button>
          </div>
          
          <div style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            {lista.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Nenhum cliente na fila.</div>
            ) : (
              lista.map(item => (
                <div key={item.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.cliente}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.servico}</div>
                  </div>
                  <div style={{ color: 'green', fontWeight: 'bold' }}>R$ {item.valor}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '11px', fontWeight: 'bold', color: '#666' }
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '15px', borderRadius: '50px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: '700', cursor: 'pointer' }
const smallBtnStyle = { padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' }
        
