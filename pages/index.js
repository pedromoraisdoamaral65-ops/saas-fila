import React from 'react'
import Head from 'next/head'

export default function Home() {
  const zapUrl = "https://wa.me/5561999445990?text=Olá,%20vim%20pela%20página%20e%20quero%20saber%20como%20funciona."

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#ffffff', margin: 0, padding: 0 }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <title>BarberFlow ® | Gestão Estilo Netflix</title>
        <style>{`
          body { margin: 0; background: #000; overflow-x: hidden; }
          .hero-bg {
            background: linear-gradient(to top, rgba(0,0,0,1) 15%, rgba(0,0,0,0.4) 50%, rgba(0,123,255,0.15) 100%);
            height: 85vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            padding: 0 20px;
          }
          .netflix-card:hover {
            transform: scale(1.05);
            background-color: #1f1f1f !important;
          }
          .btn-pill:hover {
            background-color: #0056b3 !important;
            transform: scale(1.05);
          }
          .faq-box {
            background-color: #2d2d2d;
            padding: 30px;
            margin-bottom: 15px;
            border-radius: 15px;
          }
          transition { transition: all 0.3s ease; }
        `}</style>
      </Head>

      {/* NAVBAR */}
      <nav style={{ padding: '25px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', width: '100%', zIndex: 10, boxSizing: 'border-box' }}>
        <div style={{ fontWeight: '900', fontSize: '32px', color: '#007bff', letterSpacing: '-2px' }}>BARBERFLOW</div>
        <a href={zapUrl} className="btn-pill" style={{ backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', padding: '12px 30px', borderRadius: '50px', fontWeight: '700', fontSize: '14px', transition: '0.3s' }}>Entrar</a>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-bg">
        <h1 style={{ fontSize: 'clamp(45px, 7vw, 75px)', fontWeight: '900', maxWidth: '900px', margin: '0 0 15px 0', lineHeight: '1' }}>
          Filas intermináveis agora <br/>são coisa do passado.
        </h1>
        <p style={{ fontSize: 'clamp(18px, 3vw, 26px)', marginBottom: '35px', maxWidth: '800px', fontWeight: '400' }}>
          Assista ao crescimento da sua barbearia. Gestão online em qualquer lugar.
        </p>
        
        <a href={zapUrl} className="btn-pill" style={{ 
          backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', padding: '22px 60px', 
          borderRadius: '100px', fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: '900', 
          display: 'flex', alignItems: 'center', transition: '0.3s'
        }}>
          QUERO SABER COMO FUNCIONA <span style={{ marginLeft: '15px', fontSize: '30px' }}>&rsaquo;</span>
        </a>
      </section>

      {/* RECURSOS */}
      <section style={{ padding: '0 5% 60px 5%', marginTop: '-80px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Recursos Recomendados</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          {[
            { t: "Fila Digital", d: "Seu cliente agenda por QR Code ou link em segundos." },
            { t: "Dashboard", d: "Veja o lucro da sua barbearia em tempo real, onde estiver." },
            { t: "Comissões", d: "Cálculo automático e justo para todos os seus barbeiros." },
            { t: "Sem Fidelidade", d: "Liberdade total para cancelar ou mudar quando quiser." }
          ].map((item, i) => (
            <div key={i} className="netflix-card" style={{ backgroundColor: '#141414', padding: '25px', borderRadius: '12px', border: '1px solid #222', transition: '0.3s' }}>
              <h3 style={{ color: '#007bff', fontSize: '20px', marginBottom: '10px', fontWeight: '900' }}>{item.t}</h3>
              <p style={{ color: '#999', fontSize: '15px' }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ DETALHADO */}
      <section style={{ padding: '70px 5%', borderTop: '8px solid #222', backgroundColor: '#000' }}>
        <h2 style={{ fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: '900', textAlign: 'center', marginBottom: '60px' }}>Perguntas frequentes</h2>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="faq-box">
            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>O que é exatamente o BarberFlow e como ele ajuda meu negócio?</h3>
            <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '15px' }}>
              O BarberFlow é uma plataforma de gestão e agendamento inteligente desenvolvida especificamente para o mercado de beleza masculina. 
              Diferente de sistemas genéricos, nós focamos na agilidade que uma barbearia moderna exige. Ao implementar nossa tecnologia, 
              você elimina a desorganização de agendas em papel ou conversas soltas no WhatsApp que acabam se perdendo durante o dia. 
              Nosso sistema permite que o proprietário tenha uma visão macro do negócio, identificando quais horários são mais produtivos e quais barbeiros 
              estão performando melhor. Além disso, a interface foi desenhada para ser intuitiva tanto para você quanto para seu cliente final. 
              A tecnologia trabalha como um funcionário extra, cuidando da parte burocrática enquanto você foca no corte. 
              Isso resulta em uma barbearia muito mais profissional, atraindo clientes de maior ticket médio. 
              Com o BarberFlow, você para de apagar incêndios e começa a gerir uma empresa de verdade. 
              É o fim das brigas por horários e o início de uma operação lucrativa e escalável.
            </p>
          </div>

          <div className="faq-box">
            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Como funciona o sistema de fila online e o agendamento por link?</h3>
            <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '15px' }}>
              O funcionamento é extremamente simples e eficiente para evitar qualquer barreira de entrada para o seu cliente. 
              Assim que você assina o BarberFlow, sua barbearia ganha um link exclusivo e personalizado que pode ser colocado na bio do Instagram. 
              Quando o cliente clica nesse link, ele vê em tempo real a sua disponibilidade e a de todos os barbeiros da equipe. 
              Ele escolhe o serviço, o profissional de preferência e o horário, recebendo uma confirmação imediata sem precisar ligar. 
              Para barbearias que trabalham por ordem de chegada, oferecemos o módulo de Fila Digital via QR Code na recepção. 
              O cliente escaneia o código ao chegar e pode acompanhar a posição dele na fila diretamente pelo próprio smartphone. 
              Isso dá liberdade para o cliente sair, tomar um café ou resolver algo rápido nas proximidades enquanto espera. 
              O sistema envia notificações automáticas quando o barbeiro está prestes a liberar a cadeira para o próximo atendimento. 
              Essa transparência reduz drasticamente a ansiedade da espera e evita que o cliente desista e vá embora. 
              É uma experiência VIP que diferencia sua barbearia de qualquer concorrente amador na região.
            </p>
          </div>

          <div className="faq-box">
            <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Como são feitos os cálculos de comissões e o fechamento de caixa?</h3>
            <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '15px' }}>
              Um dos maiores desafios de um dono de barbearia é o fechamento financeiro no final do dia ou da semana. 
              No BarberFlow, cada serviço realizado é registrado automaticamente vinculado ao barbeiro que executou a tarefa. 
              Você configura previamente a porcentagem de comissão de cada profissional e o sistema faz o cálculo matemático exato. 
              Isso elimina erros humanos e possíveis discussões ou desconfianças entre a equipe e a gerência do estabelecimento. 
              Ao final do período, você gera um relatório detalhado com apenas dois cliques, sabendo exatamente quanto deve pagar a cada um. 
              O fechamento de caixa também monitora entradas em dinheiro, pix, cartão de débito e crédito de forma separada e organizada. 
              Você consegue ver o faturamento bruto, descontar as taxas de cartão e visualizar o seu lucro líquido real. 
              Ter esses dados na mão permite que você tome decisões baseadas em fatos, não em achismos ou sentimentos. 
              Você saberá exatamente se é o momento de contratar um novo profissional ou investir em novos equipamentos. 
              O controle financeiro deixa de ser um pesadelo e passa a ser a ferramenta que guiará o seu crescimento. 
              Segurança, precisão e transparência total para o seu bolso e para a sua equipe de profissionais.
            </p>
          </div>

        </div>
        
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <a href={zapUrl} className="btn-pill" style={{ backgroundColor: '#007bff', color: '#fff', textDecoration: 'none', padding: '20px 50px', borderRadius: '100px', fontWeight: '900', fontSize: '20px', transition: '0.3s', display: 'inline-block' }}>QUERO TESTAR AGORA</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '70px 10%', borderTop: '8px solid #222', color: '#757575', textAlign: 'center' }}>
        <p style={{ marginBottom: '35px' }}>BARBERFLOW ENTERPRISE S.A. - 2026</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {["Termos", "Privacidade", "Suporte", "Cookies"].map((l, i) => (
            <span key={i} style={{ fontSize: '13px', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
