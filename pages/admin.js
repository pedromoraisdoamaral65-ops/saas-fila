import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ucghxvsaouiribuhjkqz.supabase.co', 'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r')

export default function AdminGatewayStyle() {
  const [step, setStep] = useState(2) // Começa direto na lista para parecer dashboard
  const [loading, setLoading] = useState(false)
  const [todosDados, setTodosDados] = useState([])
  const [form, setForm] = useState({ cliente: '', servico: 'Corte', valor: 50 })

  const carregarDados = async () => {
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
    if (data) setTodosDados(data)
  }

  useEffect(() => { carregarDados() }, [])

  const faturamentoHoje = todosDados
    .filter(i => i.status === 'concluido' && new Date(i.created_at).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + Number(curr.valor), 0)

  const filaEspera = todosDados.filter(i => i.status === 'pendente')

  const finalizarCadastro = async () => {
    if (!form.cliente) return alert('Nome do cliente é obrigatório')
    setLoading(true)
    await supabase.from('agendamentos').insert([{ ...form, status: 'pendente' }])
    await carregarDados()
    setLoading(false)
    setStep(2)
  }

  const concluirCorte = async (id) => {
    await supabase.from('agendamentos').update({ status: 'concluido' }).match({ id })
    carregarDados()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif', color: '#1E293B' }}>
      
      {/* HEADER TIPO GATEWAY */}
      <div style={{ backgroundColor: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#0F172A' }}>BARBERFLOW <span style={{color: '#64748B', fontWeight: '400'}}>| Merchant</span></h1>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        
        {/* CARDS DE MÉTRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          <div style={cardDash}>
            <span style={labelStyle}>VOLUME DE HOJE</span>
            <h2 style={valueStyle}>R$ {faturamentoHoje.toFixed(2)}</h2>
            <div style={{...indicator, backgroundColor: '#10B981'}}></div>
          </div>
          <div style={cardDash}>
            <span style={labelStyle}>EM ESPERA</span>
            <h2 style={valueStyle}>{filaEspera.length} <small style={{fontSize:'12px', fontWeight:'400'}}>clientes</small></h2>
            <div style={{...indicator, backgroundColor: '#3B82F6'}}></div>
          </div>
        </div>

        {step === 1 ? (
          <div style={formCard}>
            <h3 style={{marginTop: 0, fontSize: '16px'}}>Novo Recebimento</h3>
            <label style={labelInput}>NOME DO CLIENTE</label>
            <input style={inputStyle} onChange={e => setForm({...form, cliente: e.target.value})} placeholder="Ex: João Silva" />
            
            <label style={labelInput}>VALOR DO SERVIÇO</label>
            <input style={inputStyle} type="number" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} />
            
            <button onClick={finalizarCadastro} style={mainBtn}>CONFIRMAR AGENDAMENTO</button>
            <button onClick={() => setStep(2)} style={secondaryBtn}>CANCELAR</button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Transações Pendentes</h3>
              <button onClick={() => setStep(1)} style={addBtn}>+ NOVO CLIENTE</button>
            </div>

            {filaEspera.length === 0 ? (
              <div style={emptyState}>Nenhuma transação pendente.</div>
            ) : (
              filaEspera.map(item => (
                <div key={item.id} style={transactionItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={avatar}>{item.cliente[0].toUpperCase()}</div>
                    <div>
                      <div style={{fontWeight: '600', fontSize: '14px'}}>{item.cliente}</div>
                      <div style={{fontSize: '12px', color: '#64748B'}}>{item.servico}</div>
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontWeight: '700', fontSize: '14px', marginBottom: '5px'}}>R$ {item.valor}</div>
                    <button onClick={() => concluirCorte(item.id)} style={concluirBtn}>LIQUIDAR</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ESTILOS ESTILO GATEWAY (STRIPE/PAGARME)
const cardDash = { backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }
const indicator = { position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px' }
const labelStyle = { fontSize: '10px', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px' }
const valueStyle = { fontSize: '24px', fontWeight: '800', margin: '5px 0 0 0', color: '#0F172A' }
const formCard = { backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
const labelInput = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px' }
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }
const mainBtn = { width: '100%', padding: '14px', backgroundColor: '#0F172A', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }
const secondaryBtn = { width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#64748B', fontSize: '13px', cursor: 'pointer' }
const addBtn = { backgroundColor: '#3B82F6', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }
const transactionItem = { backgroundColor: '#FFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
const avatar = { width: '36px', height: '36px', backgroundColor: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#64748B' }
const concluirBtn = { backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #10B981', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }
const emptyState = { textAlign: 'center', padding: '40px', color: '#94A3B8', border: '2px dashed #E2E8F0', borderRadius: '12px' }
          
