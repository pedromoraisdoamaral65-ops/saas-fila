// --- BANCO DE DADOS LOCAL ---
let db = JSON.parse(localStorage.getItem('barber_flow_v3')) || [];
let sessao = JSON.parse(sessionStorage.getItem('active_user')) || null;

// --- REGRA DE SEGURANÇA (8+ dígitos, Maiúscula, Símbolo) ---
const senhaValida = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(s);

function render() {
    const app = document.getElementById('app');
    const path = window.location.pathname;
    if (path.includes('/admin')) {
        sessao ? app.innerHTML = ViewDashboard() : app.innerHTML = ViewLogin();
    } else {
        app.innerHTML = ViewLanding();
    }
}

function ViewLanding() {
    return `
    <div style="text-align:center; padding-top:80px">
        <h1 style="font-size:42px; background: linear-gradient(to right, #fff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800">BARBER FLOW.</h1>
        <p style="color:#8899a6; font-size:18px">Gestão inteligente para barbeiros.</p>
        <button class="btn-blue" style="margin-top:30px" onclick="window.location.href='/admin'">ACESSAR PAINEL ADMIN</button>
    </div>`;
}

function ViewLogin() {
    return `
    <div class="card">
        <h2>Login Admin</h2>
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="pass" placeholder="Senha">
        <button class="btn-blue" onclick="acaoLogin()">ENTRAR</button>
        <p style="text-align:center; font-size:14px; color:#8899a6">Novo? <span onclick="document.getElementById('app').innerHTML = ViewCadastro()" style="color:var(--secondary); cursor:pointer">Criar Conta</span></p>
    </div>`;
}

function ViewCadastro() {
    return `
    <div class="card">
        <h2>Criar Conta</h2>
        <p style="font-size:12px; color:#8899a6; margin-bottom:15px">Requisitos: 8+ caracteres, Letra Maiúscula e Símbolo (!@#).</p>
        <input type="email" id="c_email" placeholder="Email">
        <input type="password" id="c_pass" placeholder="Senha Forte">
        <button class="btn-blue" onclick="acaoCadastro()">REGISTRAR</button>
        <p onclick="render()" style="text-align:center; cursor:pointer; font-size:14px">Voltar</p>
    </div>`;
}

function ViewDashboard() {
    const faturamento =
        
