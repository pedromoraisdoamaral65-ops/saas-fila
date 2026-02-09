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

function ViewLanding() {
    return `
    <header>
        <b style="font-size: 24px; letter-spacing: -1px;">FLOW<span style="color:var(--primary)">PRO</span></b>
        <span class="badge">v7.2</span>
    </header>
    <div style="padding: 40px 0; text-align:center">
        <h1 style="font-size: 48px; margin-bottom: 20px; line-height: 1;">A gestão da sua <span style="color:var(--primary)">operação</span> em um só lugar.</h1>
        <p style="color:var(--text-sub); font-size: 18px; margin-bottom: 40px">O dashboard que Barbeiros, Manicures e Donos de Lava Jato usam para escalar faturamento.</p>
        <button onclick="location.hash='#/cadastro'">Começar agora grátis</button>
        <button class="btn-secondary" onclick="location.hash='#/login'">Já tenho conta</button>
    </div>`;
}

function ViewLogin() {
    return `
    <div style="padding-top: 60px">
        <div class="card">
            <h2 style="font-size: 28px; margin-bottom: 8px">Bem-vindo de volta</h2>
            <p style="color:var(--text-sub); margin-bottom: 24px">Acesse sua conta para gerenciar vendas.</p>
            <input type="email" id="log_email" placeholder="E-mail">
            <div class="pass-box"><input type="password" id="log_pass" placeholder="Sua senha"><span class="eye" onclick="togglePass('log_pass')">👁️</span></div>
            <button onclick="login()" style="margin-top: 20px">Acessar Dashboard</button>
        </div>
        <p onclick="location.hash='#/cadastro'" style="text-align:center; color:var(--text-sub); cursor:pointer">Não tem conta? <span style="color:var(--primary)">Cadastre-se aqui.</span></p>
    </div>`;
}

function ViewCadastro() {
    return `
    <div style="padding-top: 40px">
        <div class="card">
            <h2>Criar nova conta</h2>
            <select id="reg_nicho">
                <option value="Barbearia">Barbearia</option>
                <option value="Manicure">Manicure / Estética</option>
                <option value="Lava Jato">Lava Jato</option>
            </select>
            <input type="email" id="reg_email" placeholder="E-mail principal">
            <div class="pass-box"><input type="password" id="reg_pass" placeholder="Crie uma senha forte"><span class="eye" onclick="togglePass('reg_pass')">👁️</span></div>
            <input type="password" id="reg_pass2" placeholder="Repita a senha">
            <input type="text" id="reg_fruta" placeholder="Fruta favorita (Para recuperar senha)">
            <button onclick="registrar()" style="margin-top: 20px">Finalizar Cadastro</button>
        </div>
    </div>`;
}

function ViewDashboard() {
    return `
    <header>
        <div>
            <span class="stat-label">Painel de Operação</span>
            <h3 style="margin:0; font-size: 22px">${config.nome}</h3>
        </div>
        <button onclick="sair()" style="width:auto; padding:8px 16px; background:rgba(255,50,50,0.1); color:#ff5555; font-size:12px; border-radius:100px">SAIR</button>
    </header>

    <div class="card">
        <span class="stat-label">Saldo Total Bruto (Hoje)</span>
        <div class="stat-value green">R$ ${lucros.total.toFixed(2)}</div>
        <div style="margin-top: 20px; display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border); padding-top: 20px">
            <div>
                <span class="stat-label">Lucro Líquido (ADM)</span>
                <div style="font-size: 20px; font-weight: 700">R$ ${lucros.empresa.toFixed(2)}</div>
            </div>
            <span class="badge">${config.nicho}</span>
        </div>
    </div>

    <div class="card">
        <span class="stat-label">Volume de Transações</span>
        <canvas id="flowChart" style="margin-top: 20px; max-height: 180px"></canvas>
    </div>

    <div style="margin: 40px 0 10px 0; display:flex; justify-content:space-between; align-items:center">
        <h3 style="margin:0">Fila e Pedidos</h3>
        <span style="color:var(--text-sub); font-size:14px">${fila.length} aguardando</span>
    </div>

    <div id="lista-vendas">
        ${fila.map((c, i) => `
            <div class="fila-item">
                <div>
                    <b style="font-size:16px">${c.nome}</b><br>
                    <small style="color:var(--text-sub)">Serviço em espera</small>
                </div>
                <div style="text-align:right">
                    <b style="display:block; margin-bottom:8px">R$ ${c.val.toFixed(2)}</b>
                    <button onclick="vender(${i})" style="width:auto; padding:8px 16px; font-size:12px">CONCLUIR</button>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="card" style="margin-top: 30px">
        <h4 style="margin:0 0 20px 0">Nova Transação</h4>
        <input type="text" id="add_n" placeholder="Nome do Cliente">
        <input type="number" id="add_v" placeholder="Valor da venda (R$)">
        <button onclick="addFila()">ADICIONAR À FILA</button>
        ${historico.length > 0 ? `
            <div style="margin-top: 20px; text-align:center">
                <span onclick="estornar()" style="color:#ff5555; font-size:13px; font-weight:600; cursor:pointer">❌ Estornar última venda (R$ ${historico[historico.length-1].val.toFixed(2)})</span>
            </div>
        ` : ''}
    </div>
    <div style="height: 60px"></div>
    `;
}

// LÓGICA (Mantida do V7, mas com ajustes de salvar)
window.togglePass = (id) => { const el = document.getElementById(id); el.type = el.type === "password" ? "text" : "password"; };

window.registrar = () => {
    const e = document.getElementById('reg_email').value;
    const p1 = document.getElementById('reg_pass').value;
    if (!e || p1 !== document.getElementById('reg_pass2').value) return alert("Verifique os dados!");
    db.push({email:e, pass:p1, dica:document.getElementById('reg_fruta').value, nicho:document.getElementById('reg_nicho').value});
    localStorage.setItem('flow_users', JSON.stringify(db));
    location.hash = "#/login"; render();
};

window.login = () => {
    const u = db.find(x => x.email === document.getElementById('log_email').value && x.pass === document.getElementById('log_pass').value);
    if(u) { sessionStorage.setItem('flow_sessao', JSON.stringify(u)); sessao = u; config.nicho = u.nicho; location.hash = "#/admin"; render(); }
    else alert("E-mail ou senha incorretos.");
};

window.addFila = () => {
    const n = document.getElementById('add_n').value;
    const v = parseFloat(document.getElementById('add_v').value);
    if(n && v) { fila.push({nome:n, val:v}); localStorage.setItem('flow_fila', JSON.stringify(fila)); render(); }
};

window.vender = (i) => {
    const item = fila.splice(i, 1)[0];
    historico.push(item);
    lucros.total += item.val;
    lucros.empresa += (item.val * (config.taxa / 100));
    localStorage.setItem('flow_lucros', JSON.stringify(lucros));
    localStorage.setItem('flow_hist', JSON.stringify(historico));
    localStorage.setItem('flow_fila', JSON.stringify(fila)); render();
};

window.estornar = () => {
    if(!confirm("Deseja estornar a última venda?")) return;
    const item = historico.pop();
    lucros.total -= item.val;
    lucros.empresa -= (item.val * (config.taxa / 100));
    localStorage.setItem('flow_lucros', JSON.stringify(lucros));
    localStorage.setItem('flow_hist', JSON.stringify(historico)); render();
};

window.initChart = () => {
    const ctx = document.getElementById('flowChart');
    if(!ctx) return;
    new Chart(ctx, { 
        type: 'line', 
        data: { labels: ['08h','10h','12h','14h','16h','18h'], datasets: [{ label: 'Vendas', data: [20, 50, 40, 90, 120, lucros.total], borderColor: '#00ff88', backgroundColor: 'rgba(0, 255, 136, 0.1)', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 0 }] },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, border: { display: false } } } }
    });
};

window.sair = () => { sessionStorage.clear(); location.hash = "#/"; location.reload(); };
window.onload = render; window.onhashchange = render;
