let db = JSON.parse(localStorage.getItem('barber_flow_pro')) || [];
let fila = JSON.parse(localStorage.getItem('barber_fila')) || [];
let lucros = JSON.parse(localStorage.getItem('barber_lucros')) || { dia: 0, semana: 0, mes: 0 };
let historico = JSON.parse(localStorage.getItem('barber_historico')) || [];
let sessao = JSON.parse(sessionStorage.getItem('active_user')) || null;

const render = () => {
    const app = document.getElementById('app');
    const path = window.location.pathname;
    if (path.includes('/admin')) {
        sessao ? (app.innerHTML = ViewDashboard(), initChart()) : app.innerHTML = ViewLogin();
    } else {
        app.innerHTML = ViewLanding();
    }
};

function ViewLanding() {
    return `
    <div style="text-align:center; padding-top:100px animate__animated animate__fadeIn">
        <h1 style="font-size:48px; margin-bottom:10px; background: linear-gradient(to right, #fff, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">BARBER FLOW</h1>
        <p style="color:#8899a6">O sistema dos barbeiros de elite.</p>
        <button class="btn-blue" style="width:250px; margin-top:40px" onclick="window.location.href='/admin'">ENTRAR NO PAINEL</button>
    </div>`;
}

function ViewDashboard() {
    return `
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <h3 style="color:var(--secondary); margin:0">DASHBOARD PRO</h3>
            <button onclick="acaoSair()" style="width:auto; background:#e74c3c; font-size:12px">SAIR</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-top:20px">
            <div class="stat-card" style="padding:10px; text-align:center">
                <small>HOJE</small> <br> <b style="color:#2ecc71">R$ ${lucros.dia}</b>
            </div>
            <div class="stat-card" style="padding:10px; text-align:center">
                <small>SEMANA</small> <br> <b style="color:#3498db">R$ ${lucros.semana}</b>
            </div>
            <div class="stat-card" style="padding:10px; text-align:center">
                <small>MÊS</small> <br> <b style="color:#9b59b6">R$ ${lucros.mes}</b>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="myChart"></canvas>
        </div>

        <div style="margin-top:25px">
            <h4 style="color:var(--secondary)">👤 FILA ATUAL</h4>
            ${fila.map((c, i) => `
                <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:8px">
                    <span>${c.nome} <br><small style="color:#8899a6">${c.servico}</small></span>
                    <button onclick="finalizarServico(${i}, ${c.valor})" style="width:auto; background:#2ecc71; font-size:10px">CONCLUIR</button>
                </div>
            `).join('')}
            <input type="text" id="novo-cliente" placeholder="Nome do Cliente">
            <select id="tipo-servico">
                <option value="30">Cabelo (R$30)</option>
                <option value="50">Combo (R$50)</option>
            </select>
            <button class="btn-blue" onclick="addFila()">+ ADICIONAR NA FILA</button>
        </div>

        <div style="margin-top:20px">
            <h4 style="color:#e74c3c; font-size:12px">HISTÓRICO (DESFAZER)</h4>
            ${historico.slice(-2).map((h, i) => `
                <div style="font-size:11px; display:flex; justify-content:space-between; margin-top:5px">
                    <span>${h.nome} (R$ ${h.valor})</span>
                    <span onclick="cancelarServico(${historico.length - 1 - i})" style="color:#e74c3c; cursor:pointer">ESTORNAR</span>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function initChart() {
    const ctx = document.getElementById('myChart');
    if(!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Dia', 'Semana', 'Mês'],
            datasets: [{
                label: 'Lucro R$',
                data: [lucros.dia, lucros.semana, lucros.mes],
                backgroundColor: ['#2ecc71', '#3498db', '#9b59b6'],
                borderRadius: 5
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
}

// Funções de Ação (Login, Cadastro, Fila, etc) - Mesma lógica anterior
window.addFila = () => {
    const nome = document.getElementById('novo-cliente').value;
    const sel = document.getElementById('tipo-servico');
    if(!nome) return;
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

window.cancelarServico = (index) => {
    const item = historico.splice(index, 1)[0];
    lucros.dia -= item.valor; lucros.semana -= item.valor; lucros.mes -= item.valor;
    localStorage.setItem('barber_lucros', JSON.stringify(lucros));
    localStorage.setItem('barber_historico', JSON.stringify(historico));
    render();
};

window.acaoSair = () => { sessionStorage.removeItem('active_user'); location.reload(); };
window.onload = render;
