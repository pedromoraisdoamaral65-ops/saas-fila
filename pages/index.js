// --- ESTADO DO SISTEMA ---
let utilizador = JSON.parse(localStorage.getItem('flowUser')) || null;
let ecraAtivo = 'login'; 

// Regras da Senha: 8 caracteres, Maiúscula, Minúscula, Número e Especial
const validarSenha = (senha) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(senha);
};

function render() {
    const root = document.getElementById('app');
    if (!utilizador) {
        if (ecraAtivo === 'login') root.innerHTML = htmlLogin();
        else if (ecraAtivo === 'cadastro') root.innerHTML = htmlCadastro();
        else if (ecraAtivo === 'esqueci') root.innerHTML = htmlEsqueci();
    } else {
        root.innerHTML = htmlDashboard();
    }
}

// --- TEMPLATES HTML ---
function htmlLogin() {
    return `
    <div style="max-width:350px; margin:80px auto; padding:20px; background:#1e1e1e; border-radius:10px; text-align:center; color:white;">
        <h2 style="color:#f1c40f">Flow Admin</h2>
        <input id="email" type="email" placeholder="Email" style="width:90%; padding:10px; margin:10px 0;">
        <input id="pass" type="password" placeholder="Senha" style="width:90%; padding:10px; margin:10px 0;">
        <button onclick="entrar()" style="width:95%; padding:10px; background:#f1c40f; font-weight:bold; cursor:pointer;">Entrar</button>
        <p><span onclick="mudar('cadastro')" style="color:#3498db; cursor:pointer">Criar Conta</span> | 
           <span onclick="mudar('esqueci')" style="color:#e74c3c; cursor:pointer">Esqueci a Senha</span></p>
    </div>`;
}

function htmlCadastro() {
    return `
    <div style="max-width:350px; margin:80px auto; padding:20px; background:#1e1e1e; border-radius:10px; text-align:center; color:white;">
        <h2 style="color:#2ecc71">Criar Conta</h2>
        <p style="font-size:12px; color:#ccc">Mínimo 8 caracteres, A-Z, a-z, 0-9 e símbolo.</p>
        <input id="cadEmail" type="email" placeholder="Email" style="width:90%; padding:10px; margin:5px 0;">
        <input id="cadPass" type="password" placeholder="Senha Forte" style="width:90%; padding:10px; margin:5px 0;">
        <button onclick="registar()" style="width:95%; padding:10px; background:#2ecc71; color:white; font-weight:bold; cursor:pointer;">Registar</button>
        <p onclick="mudar('login')" style="color:#3498db; cursor:pointer">Voltar</p>
    </div>`;
}

function htmlEsqueci() {
    return `
    <div style="max-width:350px; margin:80px auto; padding:20px; background:#1e1e1e; border-radius:10px; text-align:center; color:white;">
        <h2>Recuperar Senha</h2>
        <p>Enviaremos um código para o teu suporte.</p>
        <input id="recEmail" type="email" placeholder="Teu Email" style="width:90%; padding:10px; margin:10px 0;">
        <button onclick="suporte()" style="width:95%; padding:10px; background:#25D366; color:white; font-weight:bold; cursor:pointer;">Falar com Suporte</button>
        <p onclick="mudar('login')" style="color:#3498db; cursor:pointer">Voltar</p>
    </div>`;
}

function htmlDashboard() {
    return `
    <div style="padding:20px; color:white;">
        <div style="display:flex; justify-content:space-between">
            <h1 style="color:#f1c40f">✂️ Painel Flow</h1>
            <button onclick="sair()" style="background:#e74c3c; color:white; border:none; padding:5px 10px; cursor:pointer">Sair</button>
        </div>
        <div style="background:#252525; padding:15px; border-radius:10px; margin-top:20px">
            <h3>Calculadora de Comissão</h3>
            <p>Total do Dia: R$ 500,00 (Exemplo)</p>
            <input type="number" id="perc" value="50" style="width:50px"> % Profissional
            <button onclick="alert('Cálculo: Salão ganha R$ ' + (500 - (500 * (document.getElementById(\'perc\').value/100))))">Calcular Lucro</button>
        </div>
    </div>`;
}

// --- FUNÇÕES DE LÓGICA ---
window.mudar = (e) => { ecraAtivo = e; render(); };

window.registar = () => {
    const email = document.getElementById('cadEmail').value;
    const pass = document.getElementById('cadPass').value;
    if (!validarSenha(pass)) {
        alert("Senha fraca! Use 8 caracteres, letras maiúsculas, minúsculas e símbolos.");
        return;
    }
    localStorage.setItem('flowUser', JSON.stringify({ email, pass }));
    alert("Conta criada!");
    mudar('login');
};

window.entrar = () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('pass').value;
    const salvo = JSON.parse(localStorage.getItem('flowUser'));
    if (salvo && salvo.email === e && salvo.pass === p) {
        utilizador = salvo;
        render();
    } else { alert("Dados incorretos!"); }
};

window.suporte = () => {
    const email = document.getElementById('recEmail').value;
    window.open(`https://wa.me/5561999999999?text=Recuperar%20senha:%20${email}`);
};

window.sair = () => { utilizador = null; mudar('login'); };

window.onload = render;
