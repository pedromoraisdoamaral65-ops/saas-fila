// --- BANCO DE DADOS LOCAL ---
let db = JSON.parse(localStorage.getItem('barber_flow_pro')) || [];
let fila = JSON.parse(localStorage.getItem('barber_fila')) || [];
let lucros = JSON.parse(localStorage.getItem('barber_lucros')) || { dia: 0, semana: 0, mes: 0 };
let sessao = JSON.parse(sessionStorage.getItem('active_user')) || null;

// --- REGRA DE SEGURANÇA (8+ dígitos, Maiúscula, Símbolo) ---
const senhaValida = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(s);

// --- ROTEAMENTO ---
function render() {
    const app = document.getElementById('app');
    const path = window.location.pathname;
    if (path.includes('/admin')) {
        sessao ? app.innerHTML = ViewDashboard() : app.innerHTML = ViewLogin();
    } else {
        app.innerHTML = ViewLanding();
    }
}

// --- VISUAL: HOME ---
function ViewLanding() {
    return `
    <div style="text-align:center; padding-top:80px">
        <h1 style="font-size:42px; background: linear-gradient(to right, #fff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800">BARBER FLOW.</h1>
        <p style="color:#8899a6; font-size:18px">Gestão inteligente para barbeiros de elite.</p>
        <button class="btn-blue" style="margin-top:30px" onclick="window.location.href='/admin'">ACESSAR PAINEL ADMIN</button>
    </div>`;
}

// --- VISUAL: LOGIN ---
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

// --- VISUAL: CADASTRO COM TRAVA DE SEGURANÇA ---
function ViewCadastro() {
    return `
    <div class="card">
        <h2>Criar Conta</h2>
        <p style="font-size:11px; color:#8899a6; margin-bottom:15px">Requisitos: 8+ caracteres, 1 Letra Maiúscula e 1 Símbolo (!@#).</p>
        <input type="email" id="c_email" placeholder="Email">
        <input type="password" id="c_pass" placeholder="Senha Forte">
        <button class="btn-blue" onclick="acaoCadastro()">REGISTRAR</button>
        <p onclick="render()" style="text-align:center; cursor:pointer; font-size:14px">Voltar ao Login</p>
    </div>`;
}

// --- VISUAL: DASHBOARD COMPLETO (LUCROS + FILA) ---
function ViewDashboard() {
    return `
    <div class="card" style="max-width: 550px">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <span style="font-weight:800; color:var(--secondary)">DASHBOARD PRO</span>
            <button onclick="acaoSair()" style="width:auto; padding:5px 10px; background:#e74c3c; font-size:12px">SAIR</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-top:20px">
            <div class="stat-card" style="padding:10px; text-align:center">
                <small style="font-size:10px">HOJE</small>
                <h3 style="color:#2ecc71; margin:5px 0">R$ ${lucros.dia}</h3>
            </div>
            <div class="stat-card" style="padding:10px; text-align:center">
                <small style="font-size:10px">SEMANA</small>
                <h3 style="color:#3498db; margin:5px 0">R$ ${lucros.semana}</h3>
            </div>
            <div class="stat-card" style="padding:10px; text-align:center">
                <small style="font-size:10px">MÊS</small>
                <h3 style="color:#9b59b6; margin:5px 0">R$ ${lucros.mes}</h3>
            </div>
        </div>

        <div style="margin-top:25px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px">
            <h4 style="margin:0 0 15px 0; font-size:14px; color:var(--secondary)">👤 FILA DE ESPERA</h4>
            <div id="lista-fila" style="margin-bottom:15px">
                ${fila.length === 0 ? '<p style="font-size:12px; color:#8899a6">A fila está vazia.</p>' : 
                fila.map((c, i) => `
                    <div style="background:#111; padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; border-left: 3px solid var(--secondary)">
                        <span style="font-size:13px">${i+1}. <b>${c.nome}</b> <br><small style="color:#8899a6">${c.servico}</small></span>
                        <button onclick="finalizarServico(${i}, ${c.valor})" style="width:auto; padding:5px 10px; font-size:10px; background:#2ecc71">CONCLUIR</button>
                    </div>
                `).join('')}
            </div>
            
            <div style="display:flex; flex-direction:column; gap:10px; border-top: 1px solid #333; pt-15px; margin-top:10px">
                <input type="text" id="novo-cliente" placeholder="Nome do cliente" style="margin:0; padding:10px">
                <div style="display:flex; gap:10px">
                    <select id="tipo-servico" style="flex:1; margin:0; background:#222; color:white; border:1px solid #333; padding:10px; border-radius:8px">
                        <option value="30">Cabelo (R$30)</option>
                        <option value="15">Barba (R$15)</option>
                        <option value="50">Combo (R$50)</option>
                        <option value="10">Sobrancelha (R$10)</option>
                    </select>
                    <button onclick="addFila()" style="width:60px; margin:0">+</button>
                </div>
            </div>
        </div>
        
        <button onclick="enviarWhats()" style="background:#25d366; color:white; font-size:13px; margin-top:15px">📲 ENVIAR LEMBRETE (WHATSAPP)</button>
    </div>`;
}

// --- LÓGICA DE AÇÕES ---
window.acaoCadastro = () => {
    const email = document.getElementById('c_email').value;
    const pass = document.getElementById('c_pass').value;
    if (!senhaValida(pass)) return alert("SEGURANÇA: A senha deve ter 8+ dígitos, uma letra maiúscula e um símbolo (!@#).");
    db.push({ email, pass });
    localStorage.setItem('barber_flow_pro', JSON.stringify(db));
    alert("Conta criada com sucesso! Faça login.");
    render();
};

window.acaoLogin = () => {
    const user = db.find(u => u.email === document.getElementById('email').value && u.pass === document.getElementById('pass').value);
    if (user) { sessionStorage.setItem('active_user', JSON.stringify(user)); location.reload(); }
    else alert("Email ou senha incorretos.");
};

window.addFila = () => {
    const nome = document.getElementById('novo-cliente').value;
    const select = document.getElementById('tipo-servico');
    const valor = parseInt(select.value);
    const servico = select.options[select.selectedIndex].text;
    
    if(!nome) return alert("Digite o nome do cliente!");
    fila.push({ nome, valor, servico });
    localStorage.setItem('barber_fila', JSON.stringify(fila));
    render();
};

window.finalizarServico = (index, valor) => {
    fila.splice(index, 1);
    lucros.dia += valor;
    lucros.semana += valor;
    lucros.mes += valor;
    localStorage.setItem('barber_fila', JSON.stringify(fila));
    localStorage.setItem('barber_lucros', JSON.stringify(lucros));
    render();
};

window.enviarWhats = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent("Olá! Sou da Barbearia. Passando para lembrar que estamos com a fila aberta. Gostaria de vir hoje?")}`, '_blank');
};

window.acaoSair = () => { sessionStorage.removeItem('active_user'); location.reload(); };
window.onload = render;
        
