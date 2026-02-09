import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function SunizeStyleDashboard() {
  const [step, setStep] = useState(2)
  const [todosDados, setTodosDados] = useState([])
  const [form, setForm] = useState({ cliente: '', servico: 'Corte', valor: 50 })

  const carregarDados = async () => {
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (data) setTodosDados(data)
  }

  useEffect(() => { carregarDados() }, [])

  // CÁLCULOS ESTILO SUNIZE
  const vendasConcluidas = todosDados.filter(i => i.status === 'concluido')
  const totalVendas = vendasConcluidas.reduce((acc, curr) => acc + Number(curr.valor), 0)
  const quantidadeVendas = vendasConcluidas.length
  const filaEspera = todosDados.filter(i => i.status === 'pendente')

  const finalizarCadastro = async () => {
    if (!form.cliente) return alert('Nome obrigatório')
    await supabase.from('agendamentos').insert([{ ...form, status: 'pendente' }])
    await carregarDados()
    setStep(2)
  }

  const concluirCorte = async (id) => {
    await supabase.from('agendamentos').update({ status: 'concluido' }).match({ id })
    carregarDados()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'sans-serif', padding: '15px' }}>
      
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '10px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Dashboard</div>
        <div style={{ width: '35px', height: '35px', backgroundColor: '#1e293b', borderRadius: '50%', border: '1px solid #334155' }}></div>
      </div>

      {/* CARDS ESTILO SUNIZE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div style={cardSunize}>
          <div style={cardHeader}>
            <span style={cardTitle}>Total em vendas</span>
            <span style={cardIcon}>$</span>
          </div>
          <h2 style={cardValue}>R$ {totalVendas.toFixed(2)}</h2>
        </div>

        <div style={cardSunize}>
          <div style={cardHeader}>
            <span style={cardTitle}>Quantidade de vendas</span>
            <span style={cardIcon}>💳</span>
          </div>
          <h2 style={cardValue}>{quantidadeVendas}</h2>
        </div>

        <div style={cardSunize}>
          <div style={cardHeader}>
            <span style={cardTitle}>Saldo disponível</span>
            <span style={cardIcon}>📈</span>
          </div>
          <h2 style={cardValue}>R$ {totalVendas.toFixed(2)}</h2>
        </div>
      </div>

      {step === 1 ? (
        <div style={modalStyle}>
          <h3 style={{marginBottom: '20px'}}>Novo Agendamento</h3>
          <input style={inputSunize} placeholder="Nome do Cliente" onChange={e => setForm({...form, cliente: e.target.value})} />
          <button onClick={finalizarCadastro} style={btnMain}>CRIAR VENDA</button>
          <button onClick={() => setStep(2)} style={{background:'none', border:'none', color:'#94a3b8', width:'100%', marginTop:'10px'}}>Voltar</button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', color: '#94a3b8' }}>FILA DE ESPERA</span>
            <button onClick={() => setStep(1)} style={{ color: '#38bdf8', background: 'none', border: 'none', fontWeight: 'bold' }}>+ ADICIONAR</button>
          </div>

          {filaEspera.map(item => (
            <div key={item.id} style={itemFila}>
              <div>
                <div style={{fontWeight: 'bold'}}>{item.cliente}</div>
                <div style={{fontSize: '12px', color: '#94a3b8'}}>Pendente</div>
              </div>
              <button onClick={() => concluirCorte(item.id)} style={btnConcluir}>CONCLUIR</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ESTILIZAÇÃO BASEADA NO PRINT DA SUNIZE
const cardSunize = {
  backgroundColor: '#1e293b',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #334155',
}

const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }
const cardTitle = { fontSize: '14px', color: '#94a3b8' }
const cardIcon = { color: '#475569', fontSize: '16px' }
const cardValue = { fontSize: '28px', fontWeight: 'bold', margin: 0 }

const modalStyle = { backgroundColor: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155' }
const inputSunize = { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }
const btnMain = { width: '100%', padding: '15px', backgroundColor: '#38bdf8', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold' }
const itemFila = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1e293b', borderRadius: '10px', marginBottom: '10px', border: '1px solid #334155' }
const btnConcluir = { backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px 15px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }
