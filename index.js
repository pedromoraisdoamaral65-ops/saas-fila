// --- CONFIGURAÇÕES E DADOS ---
let config = JSON.parse(localStorage.getItem('flow_config')) || { nomeNegocio: "Meu Negócio", comissao: 50 };
let precos = JSON.parse(localStorage.getItem('flow_precos')) || [{serv: "Serviço Padrão", val: 50}];
let lucros = JSON.parse(localStorage.getItem('flow_lucros')) || { total: 0, empresa: 0 };
let fila = JSON.parse(localStorage.getItem('flow_fila')) || [];
let historico = JSON.parse(localStorage.getItem('flow_hist')) || [];
let db = JSON.parse(localStorage.getItem('flow_users')) || [];
let sessao = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;

const render = () => {
    const app = document.getElementById('app');
    const path = window.location.pathname;
    if (path.includes('/admin')) {
        sessao ? (app.innerHTML = ViewDashboard(), initChart()) : app.innerHTML = ViewLogin();
    } else { app.innerHTML = ViewLanding(); }
};

// --- VIEWS ---
function ViewLanding() {
    return `
    <div style="text-align:center; padding-top:120px">
        <h1 style="font-size:45px; font-weight:800; letter-spacing:-1px; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FLOW MASTER<span style="color:#00d4ff; -webkit-text-fill-color: #00d4ff">.</span></h1>
        <p style="color:#8899a6; margin-top:-10px">O cérebro do seu negócio.</p>
        <button class="btn-main" style="width:240px; margin-top:50px" onclick="window.location.href='/admin'">GESTÃO PROFISSIONAL</button>
    </div>`;
}

function ViewLogin() {
    return `
    <div class="card">
        <h2>Entrar</h2>
        <input type="email" id="email" placeholder="Seu e-mail">
        <input type="password" id="pass" placeholder="Sua senha">
        <button class="btn-main" onclick="acaoLogin()">ACESSAR PAINEL</button>
        <p style="font-size:12px; text-align:center; color:#8899a6; margin-top:20px">Novo sócio? <span onclick="document.getElementById('app').innerHTML = ViewCadastro()" style="color:#00d4ff; cursor:pointer">Registrar-se</span></p>
    </div>`;
}

function ViewCadastro() {
    return `
    <div class="card">
        <h2>Seja um Sócio</h2>
        <p style="font-size:11px; color:#8899a6">Mínimo 8 caracteres, 1 Maiúscula e 1 Símbolo.</p>
        <input type="email" id="c_email" placeholder="E-mail principal">
        <input type="password" id="c_pass" placeholder="Crie sua senha forte">
        <button class="btn-main" onclick="acaoCadastro()">FINALIZAR REGISTRO</button>
    </div>`;
}

function ViewDashboard() {
    return `
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
            <div>
                <h4 style="margin:0; color:#00d4ff">${config.nomeNegocio.toUpperCase()}</h4>
                <small style="font-size:10px; color:#8899a6">PAINEL DE CONTROLE</small>
            </div>
            <button onclick="acaoSair()" style="width:auto; background:#ff4757; padding:6px 12px; font-size:10px">SAIR</button>
        </div>

        <div class="stat-grid">
            <div class="stat-box"><small>BRUTO TOTAL</small><br><b style="color:#2ecc71; font-size:18px">R$ ${lucros.total}</b></div>
            <div class="stat-box"><small>LUCRO EMPRESA</small><br><b style="color:#00d4ff; font-size:18px">R$ ${lucros.empresa}</b></div>
        </div>

        <div style="height:180px; margin-top:20px"><canvas id="flowChart"></canvas></div>

        <details style="margin-top:20px">
            <summary>⚙️ CONFIGURAR NEGÓCIO</summary>
            <div style="padding:10px 0">
                <input type="text" id="conf_nome" placeholder="Nome do Negócio" value="${config.nomeNegocio}">
                <input type="number" id="conf_com" placeholder="% Comissão Profissional" value="${config.comissao}">
                <button onclick="salvarConfig()" style="background:#00d4ff; color:#000; padding:8px; font-size:12px">SALVAR CONFIGS</button>
                <p style="font-size:11px; margin-top:15px; color:#8899a6">TABELA DE PREÇOS:</p>
                <div id="lista-precos">${precos.map((p,i) => `<div style="display:flex; gap:5px"><input type="text" value="${p.serv}" onchange="editP(${i},'serv',this.value)"><input type="number" value="${p.val}" onchange="editP(${i},'val',this.value)"></div>`).join('')}</div>
                <button onclick="salvarPrecos()" style="background:transparent; border:1px solid #333; color:#fff; font-size:10px; margin-top:5px">+ ATUALIZAR TABELA</button>
            </div>
        </details>

        <div style="margin-top:30px">
            <h4 style="margin-bottom:15px; font-size:14px">👤 FILA ATIVA</h4>
            ${fila.length === 0 ? '<p style="color:#555; font-size:12px">Ninguém na fila...</p>' : fila.map((c, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:12px; border-radius:12px; margin-bottom:8px">
                    <span>${c.nome}<br><small style="color:#8899a6">${c.serv} (R$${c.val})</small></span>
                    <div style="display:flex; gap:8px">
                        <button onclick="chamar('${c.nome}')" style="width:auto; background:#25d366; padding:8px">📲</button>
                        <button onclick="concluir(${i})" style="width:auto; background:#2ecc71; padding:8px 15px; font-size:11px">OK</button>
                    </div>
                </div>
            `).join('')}
            <input type="text" id="add_nome" placeholder="Nome do Cliente">
            <select id="add_serv">${precos.map(p => `<option value="${p.val}">${p.serv} (R$${p.val})</option>`).join('')}</select>
            <button class="btn-main" onclick="addFila()">+ ADICIONAR À FILA</button>
        </div>

        <div style="margin-top:20px; opacity:0.6">
            <h4 style="font-size:11px; color:#ff4757">ESTORNAR ÚLTIMOS:</h4>
            ${historico.slice(-2).reverse().map((h, i) => `
                <div style="display:flex; justify-content:space-between; font-size:10px; padding:5px 0">
                    <span>${h.nome} (R$${h.val})</span>
                    <span onclick="estornar(${historico.length - 1 - i})" style="color:#ff4757; cursor:pointer">DESFAZER</span>
                </div>
            `).join('')}
        </div>
    </div>`;
}

// --- LÓGICA ---
function initChart() {
    const ctx = document.getElementById('flowChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Total Bruto', 'Lucro Empresa'],
            datasets: [{
                data: [lucros.total, lucros.empresa],
                borderColor: '#00d4ff', backgroundColor: 'rgba(0, 212, 255, 0.1)', fill: true, tension: 0.4
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

window.acaoCadastro = () => {
    const email = document.getElementById('c_email').value;
    const pass = document.getElementById('c_pass').value;
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(pass)) return alert("Senha fraca!");
    db.push({ email, pass });
    localStorage.setItem('flow_users', JSON.stringify(db));
    alert("Sócio registrado!"); render();
};

window.acaoLogin = () => {
    const user = db.find(u => u.email === document.getElementById('email').value && u.pass === document.getElementById('pass').value);
    if (user) { sessionStorage.setItem('flow_sessao', JSON.stringify(user)); location.reload(); }
    else alert("Erro!");
};

window.salvarConfig = () => {
    config.nomeNegocio = document.getElementById('conf_nome').value;
    config.comissao = parseInt(document.getElementById('conf_com').value);
    localStorage.setItem('flow_config', JSON.stringify(config));
    location.reload();
};

window.editP = (i, f, v) => { precos[i][f] = f === 'val' ? parseInt(v) : v; };
window.salvarPrecos = () => { localStorage.setItem('flow_precos', JSON.stringify(precos)); render(); };

window.addFila = () => {
    const nome = document.getElementById('add_nome').value;
    const sel = document.getElementById('add_serv');
    if(!nome) return;
    fila.push({ nome, val: parseInt(sel.value), serv: sel.options[sel.selectedIndex].text.split(' (')[0] });
    localStorage.setItem('flow_fila', JSON.stringify(fila));
    render();
};

window.concluir = (index) => {
    const item = fila.splice(index, 1)[0];
    historico.push(item);
    lucros.total += item.val;
    lucros.empresa += (item.val * (100 - config.comissao) / 100);
    salvar();
};

window.estornar = (index) => {
    const item = historico.splice(index, 1)[0];
    lucros.total -= item.val;
    lucros.empresa -= (item.val * (100 - config.comissao) / 100);
    salvar();
};

window.chamar = (nome) => { window.open(`https://wa.me/?text=${encodeURIComponent('Olá '+nome+'! Chegou sua vez no '+config.nomeNegocio+'!')}`); };
function salvar() {
    localStorage.setItem('flow_fila', JSON.stringify(fila));
    localStorage.setItem('flow_lucros', JSON.stringify(lucros));
    localStorage.setItem('flow_hist', JSON.stringify(historico));
    render();
}
window.acaoSair = () => { sessionStorage.removeItem('flow_sessao'); location.reload(); };
window.onload = render;
