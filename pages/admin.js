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

  const buscarDados = async () => {
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (data) setLista(data)
  }

  useEffect(() => { if (step === 2) buscarDados() }, [step])

  const finalizar = async () => {
    if (!form.cliente) return alert('Digite o nome do cliente')
    setLoading(true)
    
    // Enviando para a tabela 'agendamentos'
    const { error } = await supabase.from('agendamentos').insert([form])
    
    if (error) {
        alert('Erro no banco: ' + error.message)
        setLoading(false)
    } else {
        // AGORA VAI PARA A LISTA, NÃO PARA O WHATSAPP
        setTimeout(() => {
          setLoading(false)
          setStep(2) 
        }, 2000)
    }
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '50px' }}>🐱</h1>
      <h2>Salvando agendamento...</h2>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
      {step === 1 ? (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h1 style={{ textAlign: 'center', fontWeight: '900' }}>BarberFlow</h1>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>NOME DO CLIENTE</label>
          <input style={inputStyle} placeholder="Nome completo" onChange={e => setForm({...form, cliente: e.target.value})} />
          
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>SERVIÇO</label>
          <select style={inputStyle} onChange={e => setForm({...form, servico: e.target.value})}>
            <option>Corte</option>
            <option>Barba</option>
            <option>Combo</option>
          </select>
          <button onClick={finalizar} style={btnStyle}>CADASTRAR</button>
          <button onClick={() => setStep(2)} style={{ ...btnStyle, backgroundColor: '#666', marginTop: '10px' }}>VER LISTA</button>
        </div>
      ) : (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Agendamentos</h1>
            <button onClick={() => setStep(1)} style={{ padding: '10px', borderRadius: '10px' }}>+ Novo</button>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden' }}>
            {lista.map(item => (
              <div key={item.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.cliente}</strong>
                <span>{item.servico} - <span style={{ color: 'green' }}>R$ {item.valor}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '15px', borderRadius: '50px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: '700', cursor: 'pointer' }
