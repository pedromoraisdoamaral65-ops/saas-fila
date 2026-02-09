// --- FLOW MASTER PRO v4.1 (GITHUB PAGES READY) ---
let config = JSON.parse(localStorage.getItem('flow_cfg')) || { nome: "Flow Master Pro", taxa: 50 };
let lucros = JSON.parse(localStorage.getItem('flow_lucros')) || { total: 0, empresa: 0 };
let historico = JSON.parse(localStorage.getItem('flow_hist')) || [];
let sessao = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;

const render = () => {
    const app = document.getElementById('app');
    
    // 1. Verificação de Cookies (LGPD)
    if (!localStorage.getItem('cookies_ok')) {
        app.innerHTML = `
        <div style="background:#111; padding:20px; border:1px solid #2ecc71; border-radius:15px; position:fixed; bottom:20px; left:20px; right:20px; z-index:999">
            <p style="font-size:12px; color:#fff">🍪 Usamos cookies locais para salvar seus lucros de R$ ${lucros.total} com segurança.</p>
            <button onclick="aceitar()" style="background:#2ecc71; width:100%; padding:10px; border:none; border-radius:8px; font-weight:bold; cursor:pointer">ACEITAR E ENTRAR</button>
        </div>`;
        return;
    }

    // 2. Roteamento por Hash (Evita Erro 404 no GitHub)
    const rota = window.location.hash;

    if (rota === '#/admin' || (sessao && rota !== '#/login')) {
        if (!sessao) { window.location.hash = '#/login'; return; }
        app.innerHTML = ViewDashboard();
        setTimeout(initChart, 100);
    } else if (rota === '#/login') {
        app.innerHTML = ViewLogin();
    } else {
        app.innerHTML = ViewLanding();
    }
};

window.aceitar = () => { localStorage.setItem('cookies_ok', '1'); render(); };

function ViewLanding() {
    return `
    <div style="text-align:center; padding-top:100px">
        <h1 style="color:#fff; font-size:40px">FLOW MASTER</h1>
        <p style="color:#2ecc71; margin-top:-15px">IA MANAGEMENT</p>
        <button onclick="window.location.hash='#/admin'; render();" style="background:#2ecc71; padding:15px 40px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:30px">ENTRAR NO SISTEMA</button>
    </div>`;
}

function ViewLogin() {
    return `
    <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:25px; border:1px solid rgba(255,255,255,0.1)">
        <h2 style="text-align:center">Login</h2>
        <input type="email" id="email" placeholder="Seu E-mail" style="width:100%; padding:12px; margin:10px 0; border-radius:8px; background:#000; color:#fff; border:1px solid #333">
        <input type="password" id="pass" placeholder="Sua Senha" style="width:100%; padding:12px; margin:10px 0; border-radius:8px; background:#000; color:#fff; border:1px solid #333">
        <button onclick="login()" style="background:#2ecc71; width:100%; padding:15px; border:none; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:10px">LOGAR</button>
    </div>`;
}

function ViewDashboard() {
    return `
    <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:25px; border:1px solid rgba(255,255,255,0.1)">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <h3 style="margin:0">${config.nome}</h3>
            <button onclick="sair()" style="background:#ff4757; color:#fff; border:none; padding:5px 10px; border-radius:5px; font-size:10px; cursor:pointer">SAIR</button>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:20px">
            <div style="background:#000; padding:15px; border-radius:15px; text-align:center">
                <small style="color:#666">BRUTO HOJE</small><br><b style="color:#2ecc71; font-size:20px">R$ ${lucros.total}</b>
            </div>
            <div style="background:#000; padding:15px; border-radius:15px; text-align:center">
                <small style="color:#666">LUCRO ADM</small><br><b style="font-size:20px">R$ ${lucros.empresa.toFixed(2)}</b>
            </div>
        </div>
        <canvas id="flowChart" style="margin-top:20px; max-height:150px"></canvas>
        <button onclick="perguntarIA()" style="background:rgba(46,204,113,0.1); border:1px solid #2ecc71; color:#2ecc71; width:100%; padding:10px; border-radius:10px; margin-top:20px; cursor:pointer">🤖 ANALISAR IA</button>
        <div id="ia-res" style="font-size:11px; margin-top:10px; color:#aaa; text-align:center"></div>
    </div>`;
}

window.login = () => {
    const email = document.getElementById('email').value;
    if(!email) return alert("Digite o e-mail");
    const user = { email };
    sessionStorage.setItem('flow_sessao', JSON.stringify(user));
    sessao = user;
    window.location.hash = '#/admin';
    render();
};

window.perguntarIA = () => {
    const res = document.getElementById('ia-res');
    res.innerHTML = "Analisando dados...";
    setTimeout(() => {
        res.innerHTML = lucros.total > 0 ? "<b>Insight:</b> Seu faturamento de R$ " + lucros.total + " indica boa retenção. Foque em Combos." : "<b>Insight:</b> Use o WhatsApp para atrair novos clientes hoje!";
    }, 600);
};

window.initChart = () => {
    const ctx = document.getElementById('flowChart');
    if(!ctx) return;
    new Chart(ctx, { 
        type: 'line', 
        data: { labels: ['S', 'T', 'Q', 'Q', 'S'], datasets: [{ data: [15, 30, 25, 40, lucros.total], borderColor: '#2ecc71', tension: 0.4 }] },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
};

window.sair = () => { sessionStorage.removeItem('flow_sessao'); window.location.hash = ''; location.reload(); };
window.onload = render;
window.onhashchange = render;
