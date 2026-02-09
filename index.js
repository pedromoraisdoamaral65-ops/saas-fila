// --- FLOW MASTER PRO v5.0 (SaaS MULTIFUNCIONAL) ---
let config = JSON.parse(localStorage.getItem('flow_cfg')) || { nome: "Meu Negócio", nicho: "Barbearia", taxa: 50 };
let lucros = JSON.parse(localStorage.getItem('flow_lucros')) || { total: 0, empresa: 0 };
let precos = JSON.parse(localStorage.getItem('flow_precos')) || [
    {serv: "Corte/Mão/Ducha", val: 30},
    {serv: "Combo/Pé e Mão/Completa", val: 60}
];
let fila = JSON.parse(localStorage.getItem('flow_fila')) || [];
let db = JSON.parse(localStorage.getItem('flow_users')) || [];
let sessao = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;

// MOTOR DE SEGURANÇA (Mín 8 dígitos, Letra Maiúscula, Número e Símbolo)
const validarSenha = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(s);

const render = () => {
    const app = document.getElementById('app');
    const rota = window.location.hash;

    if (!localStorage.getItem('cookies_ok')) {
        app.innerHTML = ViewCookies(); return;
    }

    if (rota === '#/admin' || (sessao && rota !== '#/login' && rota !== '#/cadastro')) {
        if (!sessao) { window.location.hash = '#/login'; return; }
        app.innerHTML = ViewDashboard();
        setTimeout(initChart, 100);
    } else if (rota === '#/login') {
        app.innerHTML = ViewLogin();
    } else if (rota === '#/cadastro') {
        app.innerHTML = ViewCadastro();
    } else {
        app.innerHTML = ViewLanding();
    }
};

// --- VIEWS ---

function ViewCookies() {
    return `<div class="card" style="position:fixed; bottom:20px; border:1px solid #2ecc71">
        <p style="font-size:12px">🍪 <b>LGPD:</b> Seus dados de faturamento e clientes são criptografados localmente neste dispositivo.</p>
        <button onclick="localStorage.setItem('cookies_ok', '1'); render();" class="btn-green">ACEITAR E CONTINUAR</button>
    </div>`;
}

function ViewLanding() {
    return `<div style="text-align:center; padding-top:80px">
        <h1 style="font-size:45px; margin:0">FLOW <span style="color:#2ecc71">PRO</span></h1>
        <p style="color:#666; margin-top:-10px">O CÉREBRO DO SEU NEGÓCIO</p>
        <div style="margin-top:40px">
            <button onclick="window.location.hash='#/login'; render();" class="btn-green" style="width:200px">ENTRAR</button><br>
            <button onclick="window.location.hash='#/cadastro'; render();" style="background:transparent; color:#2ecc71; border:none; margin-top:15px; cursor:pointer">Criar nova conta</button>
        </div>
    </div>`;
}

function ViewCadastro() {
    return `<div class="card">
        <h2>Criar Conta</h2>
        <select id="reg_nicho"><option>Barbearia</option><option>Manicure/Estética</option><option>Lava Jato</option></select>
        <input type="email" id="reg_email" placeholder="Seu melhor E-mail">
        <input type="password" id="reg_pass" placeholder="Senha (A, a, 1, @)">
        <input type="text" id="reg_dica" placeholder="Sua fruta favorita (Recuperação)">
        <button onclick="registrar()" class="btn-green">FINALIZAR CADASTRO</button>
        <p onclick="window.location.hash=''; render();" style="text-align:center; font-size:12px; cursor:pointer; color:#666">Voltar</p>
    </div>`;
}

function ViewLogin() {
    return `<div class="card">
        <h2>Login</h2>
        <input type="email" id="log_email" placeholder="E-mail">
        <input type="password" id="log_pass" placeholder="Senha">
        <button onclick="login()" class="btn-green">ACESSAR PAINEL</button>
        <p onclick="esqueci()" style="text-align:center; font-size:12px; cursor:pointer; color:#666; margin-top:15px">Esqueci minha senha</p>
    </div>`;
}

function ViewDashboard() {
    return `<div class="card">
        <div style="display:flex; justify-content:space-between">
            <small style="color:#2ecc71">● ${config.nicho}</small>
            <button onclick="sair()" style="background:#ff4757; color:#fff; border:none; padding:4px 8px; border-radius:5px; font-size:10px; cursor:pointer">SAIR</button>
        </div>
        <h3 style="margin:10px 0">${config.nome}</h3>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
            <div style="background:#000; padding:15px; border-radius:15px; text-align:center">
                <small style="color:#666">BRUTO</small><br><b style="color:#2ecc71; font-size:20px">R$ ${lucros.total}</b>
            </div>
            <div style="background:#000; padding:15px; border-radius:15px; text-align:center">
                <small style="color:#666">LUCRO ADM</small><br><b style="font-size:20px">R$ ${lucros.empresa.toFixed(2)}</b>
            </div>
        </div>

        <canvas id
