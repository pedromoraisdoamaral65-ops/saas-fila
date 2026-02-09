// --- DADOS ---
let db = JSON.parse(localStorage.getItem('barber_flow_pro')) || [];
let fila = JSON.parse(localStorage.getItem('barber_fila')) || [];
let lucros = JSON.parse(localStorage.getItem('barber_lucros')) || { dia: 0, semana: 0, mes: 0 };
let historico = JSON.parse(localStorage.getItem('barber_historico')) || [];
let sessao = JSON.parse(sessionStorage.getItem('active_user')) || null;

// --- MOTOR DE RENDERIZAÇÃO ---
function render() {
    const app = document.getElementById('app');
    if (!app) return;

    const path = window.location.pathname;
    
    if (path.includes('/admin')) {
        if (sessao) {
            app.innerHTML = ViewDashboard();
            setTimeout(initChart, 100); // Carrega o gráfico logo após renderizar
        } else {
            app.innerHTML = ViewLogin();
        }
    } else {
        app.innerHTML = ViewLanding();
    }
}

// --- VIEWS ---
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
        <h2>Acesso Restrito</h2>
        <input type="email" id="email" placeholder="O seu email">
        <input type="password" id="pass" placeholder="A sua senha">
        <button class="btn-blue" onclick="acaoLogin()">ENTRAR</button>
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
            <div class="stat-card" style="padding:10px; text-align:center">
                <small style="font-size:9px">HOJE</small><br><b style="color:#2ecc71">R$${lucros.dia}</b>
            </div>
            <div class="stat-card" style="padding:10px; text-align:center">
                <small style="font-size:9px">SEMANA</small><br><b style="color:#3498db">R$${lucros.semana}</b>
            </div>
            <div class="stat-card" style="padding:10px; text-align:center">
                <small style="font-size:9px">MÊS</small><br><b style="color:#9b59b6">R$${lucros.mes}</b>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="myChart"></canvas>
        </div>

        <div style="margin-top:25px">
            <h4 style="color:var(--secondary); margin-bottom:10px">👤 FILA DE ESPERA</h4>
            <div id="lista-fila">
                ${fila.length === 0 ? '<p style="font-size:12px; color:#8899a6">Fila vazia.</p>' : 
                fila.map((c, i) => `
                    <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:8px; align-items:center">
                        <span style="font-size:13px">${c.nome} <br><small style="color:#8899a6">${c.servico}</small></span>
                        <button onclick="finalizarServico(${i}, ${c.valor})" style="width:auto; background:#2ecc71; font-size:10px; padding:5px">OK</button>
                    </div>
                `).join('')}
            </div>
            <input type="text" id="novo-cliente" placeholder="Nome do Cliente">
            <select id="tipo-servico">
                <option value="30">Cabelo (R$30)</option>
                <option value="50">Combo (R$50)</option>
                <option value="15">Barba (R$15)</option>
            </select>
            <button class="btn-blue" onclick="addFila()">ADICIONAR À FILA</button>
        </div>
    </div>`;
}

// --- LÓGICA DO GRÁFICO ---
function initChart() {
    try {
        const ctx = document.getElementById('myChart');
        if (!ctx) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Dia', 'Sem.', 'Mês'],
                datasets: [{
                    label: 'Lucro R$',
                    data: [lucros.dia, lucros.semana, lucros.mes],
                    backgroundColor: ['#2ecc71', '#3498db', '#9b59b6'],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } } }
            }
        });
    } catch (e) { console.error("Erro no gráfico:", e); }
}

// --- AÇÕES ---
window.acaoLogin = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    // Para facilitar o teu teste agora, qualquer login entra, ou podes usar o teu do DB
    sessionStorage.setItem('active_user', JSON.stringify({email}));
    location.reload();
};

window.addFila = () => {
    const nome = document.getElementById('novo-cliente').value;
    const sel = document.getElementById('tipo-servico');
    if(!nome) return alert("Digite o nome!");
    fila.push({ nome, valor: parseInt(sel.value), servico: sel.options[sel.selectedIndex].text });
    localStorage.setItem('barber_fila', JSON.stringify(fila));
    render();
};

window.finalizarServico = (index, valor) => {
    const item = fila.splice(index, 1)[0];
    historico.push(item);
    lucros.dia += valor; lucros.semana += valor; lucros.mes += valor;
    localStorage.setItem('barber_fila', JSON.stringify(fila));
    localStorage.setItem('barber_lucros', JSON.stringify(lucros));
    localStorage.setItem('barber_historico', JSON.stringify(historico));
    render();
};

window.acaoSair = () => { sessionStorage.removeItem('active_user'); location.reload(); };

// Inicia o sistema
window.onload = render;
