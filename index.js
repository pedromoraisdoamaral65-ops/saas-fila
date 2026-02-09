// --- SISTEMA DE DADOS ---
// Armazena todos os usuários num array dentro do LocalStorage
let usuarios = JSON.parse(localStorage.getItem('flow_db')) || [];
let userLogado = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;
let telaAtual = 'login';

// --- VALIDAÇÃO DE SENHA (A regra que você pediu) ---
const validarSenha = (s) => {
    const temOito = s.length >= 8;
    const temMaiuscula = /[A-Z]/.test(s);
    const temMinuscula = /[a-z]/.test(s);
    const temNumero = /[0-9]/.test(s);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(s);
    return temOito && temMaiuscula && temMinuscula && temNumero && temEspecial;
};

// --- RENDERIZAÇÃO ---
function render() {
    const app = document.getElementById('app');
    if (userLogado) {
        app.innerHTML = telaDashboard();
    } else {
        if (telaAtual === 'login') app.innerHTML = telaLogin();
        else if (telaAtual === 'cadastro') app.innerHTML = telaCadastro();
    }
}

// --- COMPONENTES DE DESIGN MODERNO ---
const EstilosComuns = `
    display: flex; flex-direction: column; gap: 15px;
    background: var(--card); padding: 40px; border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4); border: 1px solid #222;
`;

const InputStyle = `
    padding: 15px; border-radius: 12px; border: 1px solid #333;
    background: #000; color: #fff; font-size: 16px; outline: none;
`;

const BtnPrincipal = (cor) => `
    padding: 15px; border-radius: 12px; border: none; font-weight: 800;
    cursor: pointer; background: ${cor}; color: #000; font-size: 16px;
    transition: transform 0.2s;
`;

// --- TELAS ---
function telaLogin() {
    return `
    <div style="${EstilosComuns}">
        <h1 style="margin:0; font-weight:800; color:var(--primary)">FLOW.</h1>
        <p style="color:#888; margin-top:-10px">Gestão Profissional de Barbearia</p>
        <input type="email" id="l_email" placeholder="Email" style="${InputStyle}">
        <input type="password" id="l_pass" placeholder="Senha" style="${InputStyle}">
        <button onclick="fazerLogin()" style="${BtnPrincipal('var(--primary)')}">Aceder ao Painel</button>
        <p style="text-align:center; font-size:14px">Novo aqui? <span onclick="irPara('cadastro')" style="color:var(--accent); cursor:pointer">Criar Conta Multinível</span></p>
    </div>`;
}

function telaCadastro() {
    return `
    <div style="${EstilosComuns}">
        <h2 style="margin:0">Nova Conta</h2>
        <p style="font-size:12px; color:#aaa">A senha deve ter 8+ dígitos, Maiúscula, Minúscula, Número e Símbolo.</p>
        <input type="email" id="c_email" placeholder="Email do Administrador" style="${InputStyle}">
        <input type="password" id="c_pass" placeholder="Criar Senha Forte" style="${InputStyle}">
        <button onclick="fazerCadastro()" style="${BtnPrincipal('#2ecc71')}">Finalizar Registo</button>
        <p onclick="irPara('login')" style="text-align:center; cursor:pointer; font-size:14px; color:#888">Voltar ao Login</p>
    </div>`;
}

function telaDashboard() {
    return `
    <div style="${EstilosComuns}">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <span style="font-weight:800">DASHBOARD</span>
            <button onclick="sair()" style="background:none; border:1px solid #e74c3c; color:#e74c3c; padding:5px 10px; border-radius:8px; cursor:pointer">Sair</button>
        </div>
        <div style="background:linear-gradient(45deg, #1a1a1a, #000); padding:20px; border-radius:15px; border-left: 4px solid var(--primary)">
            <p style="margin:0; color:#888; font-size:12px">Utilizador Ativo</p>
            <h3 style="margin:5px 0">${userLogado.email}</h3>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
            <div style="background:#1a1a1a; padding:15px; border-radius:12px; text-align:center">
                <small>Comissão</small><br><strong>50%</strong>
            </div>
            <div style="background:#1a1a1a; padding:15px; border-radius:12px; text-align:center">
                <small>Status</small><br><strong style="color:#2ecc71">Ativo</strong>
            </div>
        </div>
    </div>`;
}

// --- FUNÇÕES DE AÇÃO ---
window.irPara = (tela) => { telaAtual = tela; render(); };

window.fazerCadastro = () => {
    const email = document.getElementById('c_email').value;
    const pass = document.getElementById('c_pass').value;

    if (usuarios.find(u => u.email === email)) return alert("Este email já existe!");
    if (!validarSenha(pass)) return alert("SENHA FRACA! Use: 8 caracteres, Maiúscula, Minúscula, Número e Símbolo.");

    usuarios.push({ email, pass });
    localStorage.setItem('flow_db', JSON.stringify(usuarios));
    alert("Conta criada com sucesso! Agora faça login.");
    irPara('login');
};

window.fazerLogin = () => {
    const email = document.getElementById('l_email').value;
    const pass = document.getElementById('l_pass').value;
    const user = usuarios.find(u => u.email === email && u.pass === pass);

    if (user) {
        userLogado = user;
        sessionStorage.setItem('flow_sessao', JSON.stringify(user));
        render();
    } else {
        alert("Email ou Senha incorretos!");
    }
};

window.sair = () => {
    sessionStorage.removeItem('flow_sessao');
    userLogado = null;
    irPara('login');
};

// Inicializar
render();
