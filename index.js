// --- FLOW MASTER PRO v5.1 (FIX CARREGAMENTO) ---
const INICIAL = { nome: "Meu Negócio", nicho: "Barbearia", taxa: 50 };
let config = JSON.parse(localStorage.getItem('flow_cfg')) || INICIAL;
let lucros = JSON.parse(localStorage.getItem('flow_lucros')) || { total: 0, empresa: 0 };
let db = JSON.parse(localStorage.getItem('flow_users')) || [];
let sessao = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;

// Função principal de renderização
const render = () => {
    const app = document.getElementById('app');
    if (!app) return;

    // Reset de tela para evitar sobreposição
    app.innerHTML = "";

    // 1. Banner LGPD
    if (!localStorage.getItem('cookies_ok')) {
        app.innerHTML = ViewCookies();
        return;
    }

    // 2. Roteamento por HASH (#)
    const rota = window.location.hash || "#/";

    if (rota === "#/admin") {
        if (!sessao) { window.location.hash = "#/login"; return; }
        app.innerHTML = ViewDashboard();
        setTimeout(initChart, 100);
    } else if (rota === "#/login") {
        app.innerHTML = ViewLogin();
    } else if (rota === "#/cadastro") {
        app.innerHTML = ViewCadastro();
    } else {
        app.innerHTML = ViewLanding();
    }
};

// --- COMPONENTES DE TELA ---

function ViewCookies() {
    return `<div class="card" style="margin-top:50px; border:1px solid #2ecc71">
        <p>🍪 <b>LGPD:</b> Para sua segurança, os dados de faturamento são salvos apenas no seu navegador.</p>
        <button onclick="aceitarCookies()" class="btn-green">ENTRAR NO SISTEMA</button>
    </div>`;
}

function ViewLanding() {
    return `<div style="text-align:center; padding-top:100px; color:white">
        <h1 style="font-size:42px">FLOW <span style="color:#2ecc71">PRO</span></h1>
        <p style="color:#2ecc71; letter-spacing:3px">MULTIFUNCIONAL</p>
        <button onclick="window.location.hash='#/login'; render();" class="btn-green" style="width:220px; margin-top:30px">ACESSAR</button>
    </div>`;
}

function ViewLogin() {
    return `<div class="card">
        <h2>Login Admin</h2>
        <input type="email" id="log_email" placeholder="E-mail">
        <input type="password" id="log_pass" placeholder="Senha">
        <button onclick="login()" class="btn-green">ENTRAR</button>
        <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:12px">
            <span onclick="window.location.hash='#/cadastro'; render();" style="color:#2ecc71; cursor:pointer">Criar Conta</span>
            <span onclick="esqueci()" style="color:#666; cursor:pointer">Esqueci Senha</span>
        </div>
    </div>`;
}

function ViewDashboard() {
    return `<div class="card">
        <div style="display:flex; justify-content:space-between">
            <small style="color:#2ecc71">● ${config.nicho}</small>
            <button onclick="sair()" style="background:#ff4757; color:#fff; border:none; padding:5px 10px; border-radius:8px; cursor:pointer">SAIR</button>
        </div>
        <h2 style="margin:15px 0">${config.nome}</h2>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
            <div style="background:#000; padding:15px; border-radius:15px; text-align:center">
                <small style="color:#666">BRUTO</small><br><b style="color:#2ecc71; font-size:22px">R$ ${lucros.total}</b>
            </div>
            <div style="background:#000; padding:15px; border-radius:15px; text-align:center">
                <small style="color:#666">EMPRESA</small><br><b style="font-size:22px">R$ ${lucros.empresa.toFixed(2)}</b>
            </div>
        </div>
        <canvas id="flowChart" style="margin-top:20px; max-height:150px"></canvas>
        <button onclick="perguntarIA()" style="background:rgba(46,204,113,0.1); border:1px solid #2ecc71; color:#2ecc71; width:100%; padding:12px; border-radius:12px; margin-top:20px; font-weight:bold">🤖 ANALISAR IA</button>
        <div id="ia-res" style="font-size:12px; margin-top:15px; color:#aaa; text-align:center; line-height:1.4"></div>
    </div>`;
}

function ViewCadastro() {
    return `<div class="card">
        <h2>Novo SaaS</h2>
        <select id="reg_nicho"><option>Barbearia</option><option>Manicure/Estética</option><option>Lava Jato</option></select>
        <input type="email" id="reg_email" placeholder="Seu E-mail">
        <input type="password" id="reg_pass" placeholder="Senha (A, a, 1, @)">
        <input type="text" id="reg_fruta" placeholder="Fruta favorita (Recuperação)">
        <button onclick="registrar()" class="btn-green">CRIAR CONTA</button>
    </div>`;
}

// --- LOGICAS (LOGIN / IA / REGISTRO) ---

window.aceitarCookies = () => { localStorage.setItem('cookies_ok', '1'); render(); };

window.login = () => {
    const e = document.getElementById('log_email').value;
    const p = document.getElementById('log_pass').value;
    const user = db.find(u => u.email === e && u.pass === p);
    if (user) {
        sessionStorage.setItem('flow_sessao', JSON.stringify(user));
        sessao = user;
        config.nicho = user.nicho;
        window.location.hash = "#/admin";
        render();
    } else { alert("Dados incorretos!"); }
};

window.registrar = () => {
    const email = document.getElementById('reg_email').value;
    const pass = document.getElementById('reg_pass').value;
    const dica = document.getElementById('reg_fruta').value;
    const nicho = document.getElementById('reg_nicho').value;
    
    if (pass.length < 8) return alert("A senha deve ter no mínimo 8 dígitos.");
    
    db.push({ email, pass, dica, nicho });
    localStorage.setItem('flow_users', JSON.stringify(db));
    alert("Conta criada!");
    window.location.hash = "#/login";
    render();
};

window.esqueci = () => {
    const e = prompt("E-mail cadastrado:");
    const user = db.find(u => u.email === e);
    if (user) {
        const r = prompt("Qual sua fruta favorita?");
        if (r && r.toLowerCase() === user.dica.toLowerCase()) alert("Sua senha: " + user.pass);
        else alert("Resposta errada.");
    }
};

window.perguntarIA = () => {
    const res = document.getElementById('ia-res');
    res.innerHTML = "Calculando métricas para " + config.nicho + "...";
    setTimeout(() => {
        let conselho = config.nicho === "Barbearia" ? "Aumente o ticket médio oferecendo a sobrancelha no combo." : 
                       config.nicho === "Lava Jato" ? "Dia ensolarado! Foque no polimento cristalizado hoje." : 
                       "Fila crescendo! Priorize os agendamentos do WhatsApp.";
        res.innerHTML = `<b>IA INSIGHT:</b> ${conselho}`;
    }, 700);
};

window.initChart = () => {
    const ctx = document.getElementById('flowChart');
    if (ctx) new Chart(ctx, { type: 'line', data: { labels: ['S', 'T', 'Q', 'Q', 'S'], datasets: [{ data: [10, 25, 15, 30, lucros.total], borderColor: '#2ecc71', tension: 0.4 }] }, options: { plugins: { legend: { display: false } } } });
};

window.sair = () => { sessionStorage.clear(); window.location.hash = "#/"; location.reload(); };

// Inicialização
window.onload = render;
window.onhashchange = render;
