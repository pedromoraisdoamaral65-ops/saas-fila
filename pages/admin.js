// --- CONFIGURAÇÕES DE ESTADO ---
let usuarioLogado = JSON.parse(localStorage.getItem('userFlow')) || null;
let abaAtual = 'login'; // login, cadastro, esqueci, dash

// --- REGEX DE SEGURANÇA DA SENHA ---
// 8 caracteres, 1 minúscula, 1 maiúscula, 1 número, 1 especial
const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

function renderizar() {
    const app = document.getElementById('app') || document.body;
    app.style.backgroundColor = "#121212";
    app.style.color = "white";
    app.style.fontFamily = "sans-serif";

    if (!usuarioLogado) {
        if (abaAtual === 'login') app.innerHTML = telaLogin();
        else if (abaAtual === 'cadastro') app.innerHTML = telaCadastro();
        else if (abaAtual === 'esqueci') app.innerHTML = telaEsqueci();
    } else {
        app.innerHTML = telaDashboard();
    }
}

// --- COMPONENTES DE TELA ---

function telaLogin() {
    return `
    <div style="max-width: 400px; margin: 100px auto; padding: 20px; background: #1e1e1e; border-radius: 10px; text-align: center;">
        <h2 style="color: #f1c40f;">Flow Admin - Entrar</h2>
        <input type="email" id="email" placeholder="E-mail" style="width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none;">
        <input type="password" id="senha" placeholder="Senha" style="width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none;">
        <button onclick="fazerLogin()" style="width: 95%; padding: 10px; background: #f1c40f; border: none; font-weight: bold; cursor: pointer; border-radius: 5px;">Acessar Dashboard</button>
        <p style="margin-top: 15px;">
            <span onclick="mudarAba('cadastro')" style="color: #3498db; cursor: pointer;">Criar Conta</span> | 
            <span onclick="mudarAba('esqueci')" style="color: #e74c3c; cursor: pointer;">Esqueci a Senha</span>
        </p>
    </div>`;
}

function telaCadastro() {
    return `
    <div style="max-width: 400px; margin: 100px auto; padding: 20px; background: #1e1e1e; border-radius: 10px; text-align: center;">
        <h2 style="color: #f1c40f;">Criar Nova Conta</h2>
        <p style="font-size: 0.8em; color: #aaa;">A senha deve ter 8 caracteres, letras maiúsculas, minúsculas e caractere especial (@#$...).</p>
        <input type="email" id="novoEmail" placeholder="E-mail" style="width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none;">
        <input type="password" id="novaSenha" placeholder="Senha Forte" style="width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none;">
        <button onclick="cadastrar()" style="width: 95%; padding: 10px; background: #2ecc71; border: none; font-weight: bold; cursor: pointer; border-radius: 5px;">Finalizar Cadastro</button>
        <p onclick="mudarAba('login')" style="color: #3498db; cursor: pointer; margin-top: 15px;">Já tenho conta</p>
    </div>`;
}

function telaEsqueci() {
    return `
    <div style="max-width: 400px; margin: 100px auto; padding: 20px; background: #1e1e1e; border-radius: 10px; text-align: center;">
        <h2 style="color: #e74c3c;">Recuperar Acesso</h2>
        <p>Insira seu e-mail para receber o link de recuperação via WhatsApp do Suporte.</p>
        <input type="email" id="emailRecupera" placeholder="E-mail da conta" style="width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none;">
        <button onclick="solicitarSuporte()" style="width: 95%; padding: 10px; background: #25D366; color: white; border: none; font-weight: bold; cursor: pointer; border-radius: 5px;">Chamar Suporte no Zap</button>
        <p onclick="mudarAba('login')" style="color: #34
        
