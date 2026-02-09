import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ucghxvsaouiribuhjkqz.supabase.co', 
  'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r'
)

export default function AdminDashboard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [todosDados, setTodosDados] = useState([])
  const [form, setForm] = useState({ cliente: '', servico: 'Corte', valor: 50 })

  const carregarDados = async () => {
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (data) setTodosDados(data)
  }

  useEffect(() => { carregarDados() }, [])

  // CÁLCULOS DO DASHBOARD FINANCEIRO
  const faturamentoHoje = todosDados
    .filter(i => i.status === 'concluido' && new Date(i.created_at).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + Number(curr.valor), 0)

  const faturamentoMes = todosDados
    .filter(i => i.status === 'concluido' && new Date(i.created_at).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + Number(curr.valor), 0)

  const filaEspera = todosDados.filter(i => i.status === 'pendente')

  const finalizarCadastro = async () => {
    if (!form.cliente) return alert('Por favor, digite o nome do cliente')
    setLoading(true)
    const { error } = await supabase.from('agendamentos').insert([{ ...form, status: 'pendente' }])
    if (error) alert(error.message)
    await carregarDados()
    setLoading(false)
    setStep(2)
  }

  const concluirCorte = async (id) => {
    await supabase.from('agendamentos').update({ status: 'concluido' }).match({ id })
    carregarDados()
  }

  if (loading) return <div style={{textAlign:'center', marginTop:'100px', fontFamily:'sans-serif'}}><h1>🐱</h1><h2>Processando...</h2></div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif', padding: '15px' }}>
      
      {/* SEÇÃO DO DASHBOARD FINANCEIRO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={cardDashStyle}>
          <p style={{margin:0, fontSize:'12px', color:'#666'}}>FEITO HOJE</p>
          <h2 style={{ color: '#28a745', margin: '5px 0' }}>R$ {faturamentoHoje}</h2>
        </div>
        <div style={cardDashStyle}>
          <p style={{margin:0, fontSize:'12px', color:'#666'}}>ESTE MÊS</p>
          <h2 style={{ color: '#007bff', margin: '5px 0' }}>R$ {faturamentoMes}</h2>
        </div>
      </div>

      {step === 1 ? (
        <div style={containerFormStyle}>
          <h2 style={{textAlign:'center', marginBottom:'20px'}}>Novo na Fila</h2>
          <input style={inputStyle} placeholder="Nome do Cliente" onChange={e => setForm({...form, cliente: e.target.value})} />
          <select style={inputStyle} onChange={e => setForm({...form, servico: e.target.value})}>
             <option>Corte</option>
             <option>Barba</option>
             <option>Combo</option>
          </select>
          <input style={inputStyle} type="number" placeholder="Valor (R$)" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} />
          
          <button onClick={finalizarCadastro} style={btnStyle}>ADICIONAR À FILA</button>
          <button onClick={() => setStep(2)} style={linkBtnStyle}>VER FILA ATUAL ({filaEspera.length})</button>
        </div>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontWeight: '900', margin: 0 }}>Fila de Espera</h2>
            <button onClick={() => setStep(1)} style={addBtnStyle}>+ NOVO</button>
          </div>
          
          {filaEspera.length === 0 ? (
            <div style={{textAlign:'center', padding:'40px', backgroundColor:'#fff', borderRadius:'20px', color:'#999'}}>Ninguém na fila.</div>
          ) : (
            filaEspera.map(item => (
              <div key={item.id} style={itemListaStyle}>
                <div>
                  <strong style={{fontSize:'18px'}}>{item.cliente}</strong><br/>
                  <span style={{fontSize:'13px', color:'#666'}}>{item.servico} - R$ {item.valor}</span>
                </div>
                <button onClick={() => concluirCorte(item.id)} style={checkBtnStyle}>CONCLUIR</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ESTILOS
const cardDashStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }
const containerFormStyle = { maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', fontSize: '16px' }
const linkBtnStyle = { width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }
const itemListaStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }
const checkBtnStyle = { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold' }
const addBtnStyle = { backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' }
