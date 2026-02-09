// --- BANCO DE DADOS LOCAL ---
let db = JSON.parse(localStorage.getItem('barber_flow_pro')) || [];
let fila = JSON.parse(localStorage.getItem('barber_fila')) || [];
let lucros = JSON.parse(localStorage.getItem('barber_lucros')) || { dia: 0, semana: 0, mes: 0 };
let historico = JSON.parse(localStorage.getItem('barber_historico')) || [];
let sessao = JSON.parse(sessionStorage.getItem('active_user')) || null;

const senhaValida = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(s);

function render() {
    const app = document.getElementById('app');
    if (!app) return;
    const path = window.location.pathname;
    if (path.includes('/admin')) {
        sessao ? (app.innerHTML = ViewDashboard(), setTimeout(initChart, 100)) : app.innerHTML = ViewLogin();
    } else {
        app.innerHTML = ViewLanding();
    }
}

function ViewLanding() {
    return `
    <div style="text-align:center; padding-top:100px">
        <h1 style="font-size:42px; background: linear-gradient(to right, #fff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight:800">BARBER FLOW</h1>
        <p style="color:#8899a6">Gestão de elite para barbearias.</p>
        <button class="btn-blue" style="width:250px; margin-top:40px" onclick="window.location.href='/admin'">PAINEL ADMINISTRATIVO</button>
    </div>`;
}

function ViewLogin() {
    return `
    <div class="card">
        <h2 style="margin-bottom:20px">Login Admin</h2>
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="pass" placeholder="Senha">
        <button class="btn-blue" onclick="acaoLogin()">ENTRAR</button>
        <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:12px">
            <span onclick="document.getElementById('app').innerHTML = ViewCadastro()" style="color:var(--secondary); cursor:pointer">Criar Conta</span>
            <span onclick="alert('Reset de senha: limpe o cache do navegador.')" style="color:#8899a6; cursor:pointer">Esqueci a Senha</span>
        </div>
    </div>`;
}

function ViewCadastro() {
    return `
    <div class="card">
        <h2>Criar Conta</h2>
        <p style="font-size:11px; color:#8899a6; margin-bottom:15px">8+ dígitos, 1 Maiúscula e 1 Símbolo.</p>
        <input type="email" id="c_email" placeholder="Email">
        <input type="password" id="c_pass" placeholder="Senha Forte">
        <button class="btn-blue" onclick="acaoCadastro()">REGISTRAR</button>
        <p onclick="render()" style="text-align:center; cursor:pointer; font-size:14px; margin-top:15px">Voltar</p>
    </div>`;
}

function ViewDashboard() {
    return `
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <h3 style="color:var(--secondary); margin:0">DASHBOARD PRO</h3>
            <button onclick="acaoSair()" style="width:auto; background:#e74c3c; font-size:10px; padding:5px 10px">SAIR</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-top:20px">
            <div class="stat-card" style="padding:10px; text-align:center"><small style="font-size:9px">HOJE</small><br><b style="color:#2ecc71">R$${lucros.dia}</b></div>
            <div class="stat-card" style="padding:10px; text-align:center"><small style="font-size:9px">SEM.</small><br><b style="color:#3498db">R$${lucros.semana}</b></div>
            <div class="stat-card" style="padding:10px; text-align:center"><small style="font-size:9px">MÊS</small><br><b style="color:#9b59b6">R$${lucros.mes}</b></div>
        </div>

        <div class="chart-container"><canvas id="myChart"></canvas></div>

        <div style="margin-top:25px">
            <h4 style="color:var(--secondary); margin-bottom:10px">👤 FILA E CHAMADA</h4>
            <div id="lista-fila">
                ${fila.length === 0 ? '<p style="font-size:12px; color:#8899a6">Fila vazia.</p>' : 
                fila.map((c, i) => `
                    <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:8px; align-items:center">
                        <span style="font-size:13px">${c.nome} <br><small style="color:#8899a6">${c.servico}</small></span>
                        <div style="display:flex; gap:5px">
                            <button onclick="chamarNoWhats('${c.nome}')" style="width:auto; background:#25d366; padding:5px 8px">📲</button>
                            <button onclick="finalizarServico(${i}, ${c.valor})" style="width:auto; background:#2ecc71; padding:5px 10px; font-size:10px">OK</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <input type="text" id="novo-cliente" placeholder="Nome do Cliente">
            <select id="tipo-servico">
                <option value="30">Cabelo (R$30)</option>
                <option value="50">Combo (R$50)</option>
            </select>
            <button class="btn-blue" onclick="addFila()">ADICIONAR À FILA</button>
        </div>

        <div style="margin-top:20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top:15px">
            <h4 style="color:#e74c3c; font-size:11px">🕒 HISTÓRICO (DESFAZER)</h4>
            ${historico.slice(-2).reverse().map((h, i) => `
                <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:5px; background:rgba(231,76,60,0.1); padding:8px; border-radius:8px">
                    <span>${h.nome} - R$${h.valor}</span>
                    <span onclick="cancelarServico(${historico.length - 1 - i})" style="color:#e74c3c; cursor:pointer; font-weight:bold">CANCELAR</span>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function initChart() {
    try {
        const ctx = document.getElementById('myChart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Hoje', 'Sem.', 'Mês'],
                datasets: [{
                    label: 'Lucro R$',
                    data: [lucros.dia, lucros.semana, lucros.mes],
                    backgroundColor: ['#2ecc71', '#3498db', '#9b59b6'],
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } } } }
        });
    } catch (e) { console.error(e); }
}

window.chamarNoWhats = (nome) => {
    const msg = encodeURIComponent(`Olá ${nome}! A tua vez chegou aqui na Barbearia. Podes vir! ✂️`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
};

window.acaoCadastro = () => {
    const email = document.getElementById('c_email').value;
    const pass = document.getElementById('c_pass').value;
    if (!senhaValida(pass)) return alert("Senha fraca!");
    db.push({ email, pass });
    localStorage.setItem('barber_flow_pro', JSON.stringify(db));
    alert("Conta criada!"); render();
};

window.acaoLogin = () => {
    const user = db.find(u => u.email === document.getElementById('email').value && u.pass === document.getElementById('pass').value);
    if (user) { sessionStorage.setItem('active_user', JSON.stringify(user)); location.reload(); }
    else alert("Dados incorretos!");
};

window.addFila = () => {
    const nome = document.getElementById('novo-cliente').value;
    const sel = document.getElementById('tipo-servico');
    if(!nome) return;
    fila.push({ nome, valor: parseInt(sel.value), servico: sel.options[sel.selectedIndex].text });
    salvarEAtualizar();
};

window.finalizarServico = (index, valor) => {
    const item = fila.splice(index, 1)[0];
    historico.push(item);
    lucros.dia += valor; lucros.semana += valor; lucros.mes += valor;
    salvarEAtualizar();
};

window.cancelarServico = (index) => {
    const item = historico.splice(index, 1)[0];
    lucros.dia -= item.valor; lucros.semana -= item.valor; lucros.mes -= item.valor;
    salvarEAtualizar();
};

function salvarEAtualizar() {
    localStorage.setItem('barber_fila', JSON.stringify(fila));
    localStorage.setItem('barber_lucros', JSON.stringify(lucros));
    localStorage.setItem('barber_historico', JSON.stringify(historico));
    render();
}

window.acaoSair = () => { sessionStorage.removeItem('active_user'); location.reload(); };
window.onload = render;
