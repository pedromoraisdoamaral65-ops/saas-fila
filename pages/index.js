// --- CONFIGURAÇÕES DE SEGURANÇA E ESTADO ---
let user = JSON.parse(localStorage.getItem('flow_user')) || null;
let tela = 'login'; 

// Regra da Senha: 8 caracteres, 1 Maiúscula, 1 Minúscula, 1 Número e 1 Especial
const validarSenha = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(s);

function render() {
    const root = document.getElementById('app');
    if (!user) {
        if (tela === 'login') root.innerHTML = viewLogin();
        else if (tela === 'cadastro') root.innerHTML = viewCadastro();
        else if (tela === 'esqueci') root.innerHTML = viewEsqueci();
    } else {
        root.innerHTML = viewDash();
    }
}

// --- TELAS (HTML EM JS) ---
function viewLogin() {
    return `
    <div style="max-width:350px; margin:100px auto; padding:30px; background:#1e1e1e; border-radius:15px; text-align:center;">
        <h2 style="color:#f1c40f">Flow Admin</h2>
        <input id="email" type="email" placeholder="E-mail" style="width:100%; padding:12px; margin:10px 0; border-radius:5px; border:none;">
        <input id="pass" type="password" placeholder="Senha" style="width:100%; padding:12px; margin:10px 0; border-radius:5px; border:none;">
        <button onclick="logar()" style="width:100%; padding:12px; background:#f1c40f; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Entrar no Sistema</button>
        <p style="font-size:14px; margin-top:15px;">
            <span onclick="ir('cadastro')" style="color:#3498db; cursor:pointer">Criar Conta</span> | 
            <span onclick="ir('esqueci')" style="color:#e74c3c; cursor:pointer">Esqueci a Senha</span>
        </p>
    </div>`;
}

function viewCadastro() {
    return `
    <div style="max-width:350px; margin:80px auto; padding:30px; background:#1e1e1e; border-radius:15px; text-align:center;">
        <h2 style="color:#2ecc71">Nova Conta</h2>
        <p style="font-size:11px; color:#aaa">Senha: 8+ caracteres, A-Z, a-z, @#$ e números.</p>
        <input id="cadEmail" type="email" placeholder="E-mail" style="width:100%; padding:12px; margin:10px 0;">
        <input id="cadPass" type="password" placeholder="Senha Forte" style="width:100%; padding:12px; margin:10px 0;">
        <button onclick="criarConta()" style="width:100%; padding:12px; background:#2ecc71; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Registar Salão</button>
        <p onclick="ir('login')" style="color:#3498db; cursor:pointer; font-size:14px">Já tenho acesso</p>
    </div>`;
}

function viewEsqueci() {
    return `
    <div style="max-width:350px; margin:100px auto; padding:30px; background:#1e1e1e; border-radius:15px; text-align:center;">
        <h2 style="color:#e67e22">Recuperar Acesso</h2>
        <p style="font-size:14px">Insira o seu e-mail cadastrado:</p>
        <input id="recEmail" type="email" placeholder="Seu e-mail" style="width:100%; padding:12px; margin:10px 0;">
        <button onclick="suporte()" style="width:100%; padding:12px; background:#25D366; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Pedir Senha no WhatsApp</button>
        <p onclick="ir('login')" style="color:#3498db; cursor:pointer; font-size:14px">Voltar</p>
    </div>`;
}

function viewDash() {
    return `
    <div style="padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #333; padding-bottom:10px;">
            <h2 style="color:#f1c40f">✂️ Painel Flow Pro</h2>
            <button onclick="sair()" style="background:#e74c3c; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Sair</button>
        </div>
        <p>Bem-vindo, <b>${user.email}</b></p>
        
        <div style="background:#252525; padding:20px; border-radius:10px; margin-top:20px;">
            <h3>💰 Calculadora de Comissões</h3>
            <p>Valor do Serviço: R$ <input type="number" id="vS" value="100" style="width:60px"></p>
            <p>Comissão Profissional: <input type="number" id="pP" value="50" style="width:40px"> %</p>
            <button onclick="calc()" style="padding:10px; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer;">Calcular Divisão</button>
            <div id="result" style="margin-top:15px; font-weight:bold;"></div>
        </div>
    </div>`;
}

// --- FUNÇÕES DE LÓGICA ---
window.ir = (t) => { tela = t; render(); };

window.criarConta = () => {
    const e = document.getElementById('cadEmail').value;
    const p = document.getElementById('cadPass').value;
    if (!validarSenha(p)) return alert("ERRO: A senha precisa de 8 caracteres, maiúscula, minúscula, número e símbolo (@#$...)");
    localStorage.setItem('flow_user', JSON.stringify({ email: e, pass: p }));
    alert("Conta Criada com Sucesso!");
    ir('login');
};

window.logar = () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('pass').value;
    const s = JSON.parse(localStorage.getItem('flow_user'));
    if (s && s.email === e && s.pass === p) { user = s; render(); }
    else { alert("E-mail ou Senha incorretos!"); }
};

window.calc = () => {
    const v = document.getElementById('vS').value;
    const p = document.getElementById('pP').value;
    const prof = v * (p / 100);
    const casa = v - prof;
    document.getElementById('result').innerHTML = `Profissional: R$ ${prof.toFixed(2)} | Salão: R$ ${casa.toFixed(2)}`;
};

window.suporte = () => {
    const e = document.getElementById('recEmail').value;
    window.open(`https://wa.me/5561999999999?text=Esqueci%20minha%20senha.%20Email:%20${e}`);
};

window.sair = () => { user = null; ir('login'); };

window.onload = render;
