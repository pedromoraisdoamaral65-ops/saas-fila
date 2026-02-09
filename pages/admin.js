import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ucghxvsaouiribuhjkqz.supabase.co',
  'sb_publishable_f-8qTdYZ5pqQ16SJ0jB5Jw_wI1_8v4r'
)

export default function AdminPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ cliente: '', servico: 'Corte', valor: 50 });

  const buscarDados = async () => {
    const { data } = await supabase.from('agendamentos').select('*').order('created_at', { ascending: false });
    if (data) setLista(data);
  }

  useEffect(() => { if (step === 2) buscarDados() }, [step])

  const finalizar = async () => {
    if (!form.cliente) return alert('Digite o nome do cliente');
    setLoading(true);
    const { error } = await supabase.from('agendamentos').insert([form]);
    if (error) { alert('Erro: ' + error.message); setLoading(false); } 
    else { setLoading(false); setStep(2); }
  }

  const concluirCorte = async (id) => {
    await supabase.from('agendamentos').delete().match({ id });
    buscarDados();
  }

  if (loading) return <div style={{textAlign:'center', marginTop:'100px', fontFamily:'sans-serif'}}><h1>🐱</h1><h2>Salvando no banco...</h2></div>

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
      {step === 1 ? (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{textAlign:'center'}}>Novo Agendamento</h2>
          <input style={inputStyle} placeholder="Nome do Cliente" onChange={e => setForm({...form, cliente: e.target.value})} />
          <select style={inputStyle} onChange={e => setForm({...form, servico: e.target.value})}>
            <option>Corte</option><option>Barba</option><option>Combo</option>
          </select>
          <button onClick={finalizar} style={btnStyle}>CADASTRAR NA FILA</button>
          <button onClick={() => setStep(2)} style={{...btnStyle, backgroundColor:'#666', marginTop:'10px'}}>VER FILA ATUAL</button>
        </div>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1>Fila de Hoje</h1>
            <button onClick={() => setStep(1)} style={{padding:'10px', borderRadius:'10px', border:'none', backgroundColor:'#007bff', color:'#fff'}}>+ Novo</button>
          </div>
          {lista.map(item => (
            <div key={item.id} style={{ padding: '15px', backgroundColor:'#fff', borderRadius:'10px', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 5px rgba(0,0,0,0.05)' }}>
              <div><strong>{item.cliente}</strong><br/><small>{item.servico}</small></div>
              <button onClick={() => concluirCorte(item.id)} style={{backgroundColor:'#28a745', color:'#fff', border:'none', padding:'10px', borderRadius:'5px'}}>Concluir</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }
