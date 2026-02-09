// --- CONFIGURAÇÕES INICIAIS ---
let filaAtendimento = [
    { nome: "Marcos Silva", servico: "Corte", valor: 40, telefone: "5561999999999" },
    { nome: "Ana Unhas", servico: "Manicure", valor: 50, telefone: "5561988888888" }
];

// --- FUNÇÃO PARA RENDERIZAR A INTERFACE ---
// Esta função cria o visual direto pelo JS
function renderizarPainel() {
    const app = document.getElementById('app') || document.body;
    
    // Calcula os totais para a comissão
    let brutoTotal = filaAtendimento.reduce((acc, curr) => acc + curr.valor, 0);
    let porcentagemProfissional = 50; // Valor padrão 50%
    let comissao = brutoTotal * (porcentagemProfissional / 100);
    let lucroCasa = brutoTotal - comissao;

    app.innerHTML = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #121212; color: white; padding: 20px; border-radius: 15px;">
            <h1 style="color: #f1c40f; text-align: center;">✂️ Flow Admin Pro</h1>
            
            <h3>Fila de Espera</h3>
            <div id="lista-clientes">
                ${filaAtendimento.map((cliente, index) => `
                    <div style="background: #1e1e1e; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #f1c40f;">
                        <div>
                            <strong>${cliente.nome}</strong><br>
                            <small>${cliente.servico} - R$ ${cliente.valor.toFixed(2)}</small>
                        </div>
                        <button onclick="notificarCliente('${cliente.telefone}', '${cliente.nome}')" style="background: #25D366; color: white; border: none; padding: 10px; border-radius: 5px; cursor
