// --- FLOW MASTER PRO v3.5 (FULL VERSION) ---
let config = JSON.parse(localStorage.getItem('flow_config')) || { nomeNegocio: "Flow Master Pro", comissao: 50 };
let precos = JSON.parse(localStorage.getItem('flow_precos')) || [{serv: "Corte Simples", val: 30}];
let lucros = JSON.parse(localStorage.getItem('flow_lucros')) || { total: 0, empresa: 0 };
let fila = JSON.parse(localStorage.getItem('flow_fila')) || [];
let historico = JSON.parse(localStorage.getItem('flow_hist')) || [];
let db = JSON.parse(localStorage.getItem('flow_users')) || [];
let sessao = JSON.parse(sessionStorage.getItem('flow_sessao')) || null;

const senhaValida = (s) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(s);

const render = () => {
    const app = document.getElementById('app');
    const path = window.location.pathname;

    // Injeta Banner LGPD
    if (!localStorage.getItem('cookies_flow')) {
        app.innerHTML = ViewCookies();
        setTimeout(() => document.getElementById('cookie-banner').style.display = 'block', 500);
        return;
    }

    if (path.includes('/admin')) {
        sessao ? (app.innerHTML = ViewDashboard(), setTimeout(initChart, 100)) : app.innerHTML = ViewLogin();
    } else { app.innerHTML = ViewLanding(); }
};

// --- VIEWS ---
function ViewCookies() {
    return `<div id="cookie-banner" class="cookie-banner">
        <p style="font-size:12px; margin:0">🍪 <b>LGPD:</b> Utilizamos cookies locais para salvar seus lucros e sessões de forma segura.</p>
        <button onclick="aceitarCookies()" style="margin-top:10px; background:var(--primary); padding:8px; border-radius:8px">ACEITAR</button>
    </div>`;
}

function ViewLanding() {
    return `<div style="text-align:center; padding-top:120px">
        <h1 style="font-size:42px; font-weight:800; background: linear-gradient(#fff, #555); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FLOW MASTER</h1>
        <p style="color:#2ecc71; letter-spacing:3px; font-size:10px; margin-top:-10px">IA & MANAGEMENT</p>
        <button class="btn-main" style="width:200px; margin-top:50px" onclick="window.location.href='/admin'">LOGIN ADMIN</button>
    </div>`;
}

function ViewLogin() {
    return `<div class="card">
        <h2>Entrar</h2>
        <input type="email" id="email" placeholder="E-mail">
        <input type="password" id="pass" placeholder="Senha">
        <button class="btn-main" onclick="acaoLogin()">ACESSAR SISTEMA</button>
        <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:12px">
            <span onclick="document.getElementById('app').innerHTML = ViewCadastro()" style="color:var(--primary); cursor:pointer">Criar Conta</span>
            <span onclick="acaoEsqueci()" style="color:#666; cursor:pointer">Esqueci a Senha</span>
        </div>
    </div>`;
}

function ViewCadastro() {
    return `<div class="card">
        <h2>Novo Sócio</h2>
        <input type="email" id="c_email" placeholder="E-mail">
        <input type="password" id="c_pass" placeholder="Senha Forte">
        <input type="text" id="c_dica" placeholder="Sua fruta favorita (Segurança)">
        <button class="btn-main" onclick="acaoCadastro()">REGISTRAR</button>
        <p onclick="render()" style="text-align:center; cursor:pointer; font-size:13px; margin-top:15px; color:#555">Voltar</p>
    </div>`;
}

function ViewDashboard() {
    return `<div class="card" style="border-top: 4px solid var(--primary)">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <h4 style="margin:0">${config.nomeNegocio.toUpperCase()}</h4>
            <button onclick="acaoSair()" style="width:auto; background:#ff4757; padding:5px 10px; font-size:10px; color:white">SAIR</button>
        </div>

        <div class="stat-grid" style="margin-top:20px">
            <div class="stat-box"><small style="color:#555">BRUTO</small><br><b style="color:var(--primary); font-size:20px">R$ ${lucros.total.toFixed(2)}</b></div>
            <div class="stat-box"><small style="color:#555">EMPRESA</small><br><b style="font-size:20px">R$ ${lucros.empresa.toFixed(2)}</b></div>
        </div>

        <canvas id="flowChart" style="margin-top:20px; max-height:120px"></canvas>

        <div style="margin-top:20px; background:rgba(46, 204, 113, 0.05); padding:15px; border-radius:15px; border:1px solid rgba(46, 204, 113, 0.2)">
            <div style="display:flex; justify-content:space-between">
                <span style="font-size:11px; font-weight:bold; color:var(--primary)">🤖 FLOW IA</span>
                <button onclick="perguntarIA()" style="width:auto; background:var(--primary); padding:3px 8px; font-size:9px">ANALISAR</button>
            </div>
            <div id="ia-res" style="margin-top:8px; font-size:11px; display:none; color:#bbb"></div>
        </div>

        <details style="margin-top:20px">
            <summary>⚙️ CONFIGURAR PREÇOS E TAXAS</summary>
            <div style="padding-top:10px">
                <input type="text" id="conf_nome" value="${config.nomeNegocio}" placeholder="Nome">
                <input type="number" id="conf_com" value="${config.comissao}" placeholder="% Profissional">
                <div id="p-list">${precos.map((p,i)=>`<div style="display:flex; gap:5px"><input type="text" value="${p.serv}" onchange="editP(${i},'serv',this.value)"><input type="number" value="${p.val}" onchange="editP(${i},'val',this.value)"></div>`).join('')}</div>
                <button onclick="precos.push({serv:'Novo',val:0}); render()" style="background:transparent; border:1px dashed #444; color:#fff; font-size:10px; margin-top:5px">+ SERVIÇO</button>
                <button onclick="salvarConfig()" style="background:var(--primary); margin-top:10px">SALVAR CONFIGS</button>
            </div>
        </details>

        <div style="margin-top:30px">
            <h4 style="margin-bottom:12px; font-size:14px">👤 FILA DE CLIENTES</h4>
            <div id="f-list">${fila.length===0 ? '<p style="color:#333; font-size:11px">Fila limpa.</p>' : fila.map((c,i)=>`
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:10px; border-radius:12px; margin-bottom:8px">
                    <span style="font-size:13px"><b>${c.nome}</b><br><small style="color:#555">${c.serv}</small></span>
                    <div style="display:flex; gap:5px">
                        <button onclick="chamar('${c.nome}')" style="width:auto; background:#25d366; padding:8px">📲</button>
                        <button onclick="concluir(${i})" style="width:auto; background:var(--primary); padding:8px 12px; font-size:10px">OK</button>
                    </div>
                </div>`).join('')}</div>
            <input type="text" id="add_n" placeholder="Nome">
            <select id="add_s">${precos.map(p=>`<option value="${p.val}">${p.serv} (R$${p.val})</option>`).join('')}</select>
            <button class="btn-main" onclick="addFila()">ADICIONAR À FILA</button>
        </div>

        <div style="margin-top:20px; border-top:1px solid #111; padding-top:10px">
            <span style="font-size:10px; color:#ff4757">ÚLTIMO HISTÓRICO:</span>
            ${historico.slice(-1).map((h,i)=>`<div style="display:flex; justify-content:space-between; font-size:10px; color:#555"><span>${h.nome} - R$${h.val}</span><span onclick="estornar(${historico.length-1})" style="color:#ff4757; cursor:pointer">ESTORNAR</span></div>`).join('')}
        </div>
    </div>`;
}

// --- LOGICA ---
window.aceitarCookies = () => { localStorage.setItem('cookies_flow', '1'); render(); };

window.perguntarIA = () => {
    const r = document.getElementById('ia-res'); r.style.display = 'block'; r.innerHTML = "Analisando fluxo...";
    setTimeout(() => {
        let m = lucros.total > 500 ? "Faturamento excelente! Considere investir em marketing." : "Foco em conversão! Ofereça descontos nos serviços menos procurados.";
        if(fila.length > 2) m = "Fila cheia! Mantenha o ritmo para evitar desistências.";
        r.innerHTML = `<b>🤖 FLOW IA:</b> ${m}`;
    }, 600);
};

window.acaoCadastro = () => {
    const e = document.getElementById('c_email').value; const p = document.getElementById('c_pass').value; const d = document.getElementById('c_dica').value;
    if(!senhaValida(p)) return alert("Segurança: Use 8+ dígitos, Maiúscula e Símbolo.");
    db.push({ email: e, pass: p, dica: d }); localStorage.setItem('flow_users', JSON.stringify(db));
    alert("Conta criada!"); render();
};

window.acaoLogin = () => {
    const u = db.find(x => x.email === document.getElementById('email').value && x.pass === document.getElementById('pass').value);
    if(u) { sessionStorage.setItem('flow_sessao', JSON.stringify(u)); location.reload(); } else alert("Erro!");
};

window.acaoEsqueci = () => {
    const e = prompt("E-mail:"); const u = db.find(x => x.email === e);
    if(u) { const r = prompt("Qual sua fruta favorita?"); if(r === u.dica) alert("Senha: " + u.pass); }
};

window.initChart = () => {
    const c = document.getElementById('flowChart'); if(!c) return;
    new Chart(c, { type: 'line', data: { labels: historico.slice(-5).map((_,i)=>i+1), datasets: [{ data: historico.slice(-5).map(h=>h.val), borderColor: '#2ecc71', tension: 0.4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } } });
};

window.salvarConfig = () => {
    config.nomeNegocio = document.getElementById('conf_nome').value; config.comissao = parseInt(document.getElementById('conf_com').value);
    localStorage.setItem('flow_config', JSON.stringify(config)); localStorage.setItem('flow_precos', JSON.stringify(precos));
    location.reload();
};

window.editP = (i, f, v) => precos[i][f] = f === 'val' ? parseInt(v) : v;

window.addFila = () => {
    const n = document.getElementById('add_n').value; const s = document.getElementById('add_s'); if(!n) return;
    fila.push({ nome: n, val: parseInt(s.value), serv: s.options[s.selectedIndex].text.split(' (')[0] });
    localStorage.setItem('flow_fila', JSON.stringify(fila)); render();
};

window.concluir = (i) => {
    const x = fila.splice(i, 1)[0]; historico.push(x);
    lucros.total += x.val; lucros.empresa += (x.val * (100 - config.comissao) / 100);
    salvarGeral();
};

window.estornar = (i) => {
    const x = historico.splice(i, 1)[0];
    lucros.total -= x.val; lucros.empresa -= (x.val * (100 - config.comissao) / 100);
    salvarGeral();
};

function salvarGeral() {
    localStorage.setItem('flow_fila', JSON.stringify(fila)); localStorage.setItem('flow_lucros', JSON.stringify(lucros)); localStorage.setItem('flow_hist', JSON.stringify(historico));
    render();
}

window.chamar = (n) => window.open(`https://wa.me/?text=${encodeURIComponent('Sua vez chegou no '+config.nomeNegocio+'! Estamos te esperando.')}`);
window.acaoSair = () => { sessionStorage.removeItem('flow_sessao'); location.reload(); };
window.onload = render;
