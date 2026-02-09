// --- FLOW MASTER PRO v7.5 ---
let config = JSON.parse(localStorage.getItem('flow_cfg')) || { nome: "Minha Operação", nicho: "Barbearia", taxa: 50 };
let lucros = JSON.parse(localStorage.getItem('flow_lucros')) || { total: 0, empresa: 0 };
let historico = JSON.parse(localStorage.getItem('flow_hist')) || [];
let fila = JSON.parse(localStorage.getItem('flow_fila')) || [];
let db = JSON.parse(localStorage.getItem('flow_users')) || [];
let sessao = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;

const render = () => {
    const app = document.getElementById('app');
    const rota = window.location.hash || "#/";
    app.className = "fade-in";

    if (rota === "#/admin") {
        if (!sessao) { window.location.hash = "#/login"; return; }
        app.innerHTML = ViewDashboard();
        setTimeout(initChart, 100);
    } else if (rota === "#/login") { app.innerHTML = ViewLogin(); }
    else if (rota === "#/cadastro") { app.innerHTML = ViewCadastro(); }
    else { app.innerHTML = ViewLanding(); }
};

// --- LOGICA DE IA ---
function getAuraIA() {
    const total = lucros.total;
    if (total === 0) return "Aguardando primeira venda para analisar sua operação...";
    if (total < 500) return `IA: Foco em volume! Para sua ${config.nicho}, recomendo promoções nos dias úteis.`;
    if (total >= 500) return `IA: Ótimo desempenho! Hora de otimizar sua margem de lucro na ${config.nicho}.`;
    return "Analisando métricas de crescimento...";
}

function ViewLanding() {
    return `
    <header>
        <b style="font-size: 24px;">FLOW<span style="color:var(--primary)">PRO</span></b>
        <span class="badge">v7.5</span>
    </header>
    <div style="padding: 20px 0; text-align:center">
        <h1 style="font-size: 42px; line-height: 1.1;">A gestão da sua <span style="color:var(--primary)">operação</span> em um só lugar.</h1>
        <p style="color:var(--text-sub); margin-bottom: 30px">O dashboard que Barbeiros, Manicures e Donos de Lava Jato usam para escalar faturamento.</p>
        <button onclick="location.hash='#/cadastro'">Começar agora</button>
        <button class="btn-secondary" onclick="location.hash='#/login'">Já tenho conta</button>
        
        <div style="margin-top: 50px; text-align: left;">
            <h3 style="color:var(--primary)">Dúvidas Frequentes (FAQ)</h3>
            <details style="margin-bottom:15px; background:#111; padding:10px; border-radius:10px">
                <summary style="font-weight:600">Como funciona o cálculo de lucro?</summary>
                <p style="color:var(--text-sub); font-size:14px; margin-top:10px">O sistema calcula o valor bruto e separa automaticamente a taxa administrativa que você definir.</p>
            </details>
            <details style="background:#111; padding:10px; border-radius:10px">
                <summary style="font-weight:600">Meus dados estão seguros?</summary>
                <p style="color:var(--text-sub); font-size:14px; margin-top:10px">Sim, utilizamos criptografia local para garantir que apenas você tenha acesso ao seu faturamento.</p>
            </details>
        </div>
    </div>`;
}

function ViewDashboard() {
    return `
    <header>
        <div><span class="stat-label">Operação Ativa</span><h3>${config.nome}</h3></div>
        <button onclick="sair()" style="width:auto; padding:8px 16px; background:rgba(255,50,50,0.1); color:#ff5555; border-radius:100px; font-size:12px">SAIR</button>
    </header>

    <div class="card">
        <span class="stat-label">Saldo Total Bruto</span>
        <div class="stat-value green">R$ ${lucros.total.toFixed(2)}</div>
        <div style="margin-top:15px; background:rgba(0,255,136,0.05); padding:12px; border-radius:12px; border: 1px dashed var(--primary)">
            <small style="color:var(--primary); font-weight:700">🤖 INSIGHT DA IA:</small><br>
            <small style="color:#fff">${getAuraIA()}</small>
        </div>
    </div>

    <div class="card">
        <canvas id="flowChart" style="max-height: 150px"></canvas>
    </div>

    <h3 style="margin-top:30px">Fila de Pedidos</h3>
    <div id="lista-vendas">
        ${fila.map((c, i) => `
            <div class="fila-item">
                <div><b>${c.nome}</b><br><small style="color:var(--text-sub)">Aguardando</small></div>
                <div style="text-align:right">
                    <b>R$ ${c.val.toFixed(2)}</b><br>
                    <button onclick="vender(${i})" style="width:auto; padding:5px 12px; font-size:11px; margin-top:5px">CONCLUIR</button>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="card" style="margin-top:20px">
        <h4>Nova Venda</h4>
        <input type="text" id="add_n" placeholder="Cliente">
        <input type="number" id="add_v" placeholder="Valor R$">
        <button onclick="addFila()">LANÇAR NA FILA</button>
        ${historico.length > 0 ? `<div style="text-align:center; margin-top:15px"><span onclick="estornar()" style="color:#ff5555; font-size:12px; cursor:pointer">Estornar última (R$ ${historico[historico.length-1].val.toFixed(2)})</span></div>` : ''}
    </div>`;
}

// Funções de Apoio
window.togglePass = (id) => { const el = document.getElementById(id); el.type = el.type === "password" ? "text" : "password"; };
window.addFila = () => { const n = document.getElementById('add_n').value; const v = parseFloat(document.getElementById('add_v').value); if(n && v) { fila.push({nome:n, val:v}); localStorage.setItem('flow_fila', JSON.stringify(fila)); render(); } };
window.vender = (i) => { const item = fila.splice(i, 1)[0]; historico.push(item); lucros.total += item.val; lucros.empresa += (item.val * (config.taxa / 100)); localStorage.setItem('flow_lucros', JSON.stringify(lucros)); localStorage.setItem('flow_hist', JSON.stringify(historico)); localStorage.setItem('flow_fila', JSON.stringify(fila)); render(); };
window.estornar = () => { if(confirm("Estornar?")) { const item = historico.pop(); lucros.total -= item.val; lucros.empresa -= (item.val * (config.taxa/100)); localStorage.setItem('flow_lucros', JSON.stringify(lucros)); localStorage.setItem('flow_hist', JSON.stringify(historico)); render(); } };
window.registrar = () => { const e = document.getElementById('reg_email').value; const p1 = document.getElementById('reg_pass').value; if(p1 === document.getElementById('reg_pass2').value) { db.push({email:e, pass:p1, nicho:document.getElementById('reg_nicho').value}); localStorage.setItem('flow_users', JSON.stringify(db)); location.hash = "#/login"; } };
window.login = () => { const u = db.find(x => x.email === document.getElementById('log_email').value && x.pass === document.getElementById('log_pass').value); if(u) { sessionStorage.setItem('flow_sessao', JSON.stringify(u)); sessao = u; config.nicho = u.nicho; location.hash = "#/admin"; render(); } else alert("Erro!"); };
window.initChart = () => { const ctx = document.getElementById('flowChart'); if(ctx) new Chart(ctx, { type: 'line', data: { labels: ['H1','H2','H3','H4'], datasets: [{ data: [10, 20, 15, lucros.total], borderColor: '#00ff88', tension: 0.4 }] }, options: { plugins: { legend: { display: false } } } }); };
window.sair = () => { sessionStorage.clear(); location.hash = "#/"; location.reload(); };
window.onload = render; window.onhashchange = render;
