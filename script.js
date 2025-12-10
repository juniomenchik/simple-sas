// Dados das cédulas
// Dados das cédulas e moedas
const cedulasBRL = [
    { valor: 200, label: "R$ 200", symbol: "R$" },
    { valor: 100, label: "R$ 100", symbol: "R$" },
    { valor: 50, label: "R$ 50", symbol: "R$" },
    { valor: 20, label: "R$ 20", symbol: "R$" },
    { valor: 10, label: "R$ 10", symbol: "R$" },
    { valor: 5, label: "R$ 5", symbol: "R$" },
    { valor: 2, label: "R$ 2", symbol: "R$" },
    { valor: 1, label: "R$ 1", symbol: "R$" },    
    { valor: 0.5, label: "R$ 0,50", symbol: "R$" }, 
];

const moedasBRL = [
    { valor: 1.00, label: "R$ 1,00", symbol: "R$", tipo: "moeda", imagem: "🪙" },
    { valor: 0.50, label: "R$ 0,50", symbol: "R$", tipo: "moeda", imagem: "🪙" },
    { valor: 0.25, label: "R$ 0,25", symbol: "R$", tipo: "moeda", imagem: "🪙" },
    { valor: 0.10, label: "R$ 0,10", symbol: "R$", tipo: "moeda", imagem: "🪙" },
    { valor: 0.05, label: "R$ 0,05", symbol: "R$", tipo: "moeda", imagem: "🪙" },
];

const cedulasARS = [
    { valor: 20000, label: "$20.000", symbol: "$" },
    { valor: 10000, label: "$10.000", symbol: "$" },
    { valor: 2000, label: "$2000", symbol: "$" },
    { valor: 1000, label: "$1000", symbol: "$" },
    { valor: 500, label: "$500", symbol: "$" },
    { valor: 200, label: "$200", symbol: "$" },
    { valor: 100, label: "$100", symbol: "$" },
    { valor: 50, label: "$50", symbol: "$" },
];

// Login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const codigo = document.getElementById('codigo').value;
            
            // Código padrão - altere conforme necessário
            if (codigo === '123456') {
                localStorage.setItem('loggedIn', 'true');
                window.location.href = 'relatorio.html';
            } else {
                alert('Código inválido! Tente novamente.');
            }
        });
    }
    
    // Verificar se está logado
    if (window.location.pathname.includes('relatorio.html')) {
        if (!localStorage.getItem('loggedIn')) {
            window.location.href = 'index.html';
        } else {
            initializeRelatorio();
        }
    }
});

// Inicializar página do relatório
function initializeRelatorio() {
    // Data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dataAtual;
    
    // Criar campos para cédulas BRL
    const brlContainer = document.getElementById('brlNotes');
    cedulasBRL.forEach(cedula => {
        brlContainer.appendChild(criarCampoCedula(cedula));
    });
    
    // Criar campos para cédulas ARS
    const arsContainer = document.getElementById('arsNotes');
    cedulasARS.forEach(cedula => {
        arsContainer.appendChild(criarCampoCedula(cedula));
    });
    
    // Atualizar display da cotação
    const rateInput = document.getElementById('exchangeRate');
    const rateDisplay = document.getElementById('rateDisplay');
    
    rateInput.addEventListener('input', function() {
        rateDisplay.textContent = parseFloat(this.value).toFixed(4);
        calcularTotais();
    });
    
    calcularTotais();
}

// Criar campo para cada cédula
function criarCampoCedula(cedula) {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `
        <div class="note-header">
            <div class="note-value">${cedula.label}</div>
        </div>
        <input 
            type="number" 
            class="quantity-input" 
            min="0" 
            value="0"
            data-valor="${cedula.valor}"
            data-symbol="${cedula.symbol}"
            oninput="calcularSubtotal(this)"
        >
        <div class="note-subtotal" id="subtotal-${cedula.valor}${cedula.symbol}">
            ${cedula.symbol} 0,00
        </div>
    `;
    return div;
}

// Calcular subtotal de cada cédula
function calcularSubtotal(input) {
    const valor = parseFloat(input.dataset.valor);
    const quantidade = parseInt(input.value) || 0;
    const symbol = input.dataset.symbol;
    const subtotal = valor * quantidade;
    
    document.getElementById(`subtotal-${valor}${symbol}`).textContent = 
        `${symbol} ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    calcularTotais();
}

// Calcular totais gerais
function calcularTotais() {
    let totalBRL = 0;
    let totalARS = 0;
    
    // Calcular BRL
    cedulasBRL.forEach(cedula => {
        const input = document.querySelector(`input[data-valor="${cedula.valor}"][data-symbol="R$"]`);
        const quantidade = parseInt(input?.value) || 0;
        totalBRL += cedula.valor * quantidade;
    });
    
    // Calcular ARS
    cedulasARS.forEach(cedula => {
        const input = document.querySelector(`input[data-valor="${cedula.valor}"][data-symbol="$"]`);
        const quantidade = parseInt(input?.value) || 0;
        totalARS += cedula.valor * quantidade;
    });
    
    // Atualizar displays
    document.getElementById('totalBRL').textContent = 
        `R$ ${totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    document.getElementById('totalARS').textContent = 
        `$ ${totalARS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    // Converter ARS para BRL
    const cotacao = parseFloat(document.getElementById('exchangeRate').value) || 0.0058;
    const totalARSinBRL = totalARS * cotacao;
    const totalGeral = totalBRL + totalARSinBRL;
    
    document.getElementById('totalGeral').textContent = 
        `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    // Atualizar resumo detalhado
    atualizarResumo(totalBRL, totalARS, totalGeral, cotacao);
}

// Atualizar resumo detalhado
function atualizarResumo(totalBRL, totalARS, totalGeral, cotacao) {
    const summaryDiv = document.getElementById('detailedSummary');
    
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    
    summaryDiv.innerHTML = `
        <h4>Resumo Detalhado - ${dataAtual} ${horaAtual}</h4>
        
        <div style="margin-top: 15px;">
            <p><strong>Reais (BRL):</strong> R$ ${totalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Pesos Argentinos (ARS):</strong> $ ${totalARS.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Cotação utilizada:</strong> 1 ARS = ${cotacao.toFixed(4)} BRL</p>
            <p><strong>Total ARS convertido:</strong> R$ ${(totalARS * cotacao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Total Geral (BRL):</strong> R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <h5 style="margin-top: 20px;">Detalhamento por Cédula:</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
            <div>
                <strong>Reais:</strong>
                ${cedulasBRL.map(cedula => {
                    const input = document.querySelector(`input[data-valor="${cedula.valor}"][data-symbol="R$"]`);
                    const qtd = parseInt(input?.value) || 0;
                    return qtd > 0 ? `<p>${cedula.label}: ${qtd} x R$ ${cedula.valor} = R$ ${(qtd * cedula.valor).toFixed(2)}</p>` : '';
                }).join('')}
            </div>
            <div>
                <strong>Pesos:</strong>
                ${cedulasARS.map(cedula => {
                    const input = document.querySelector(`input[data-valor="${cedula.valor}"][data-symbol="$"]`);
                    const qtd = parseInt(input?.value) || 0;
                    return qtd > 0 ? `<p>${cedula.label}: ${qtd} x $ ${cedula.valor} = $ ${(qtd * cedula.valor).toFixed(2)}</p>` : '';
                }).join('')}
            </div>
        </div>
    `;
}


// Gerar PDF
function gerarPDF() {
    // Verificar se jsPDF está disponível
    if (typeof window.jspdf === 'undefined') {
        alert('Biblioteca de PDF não carregada!');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Data e hora
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    
    // Título
    doc.setFontSize(20);
    doc.text("Relatório Diário de Cédulas", 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Data: ${dataAtual} - Hora: ${horaAtual}`, 105, 25, { align: 'center' });
    
    let yPos = 40;
    
    // Cédulas BRL
    doc.setFontSize(16);
    doc.text("Cédulas em Reais (BRL):", 14, yPos);
    yPos += 10;
    
    doc.autoTable({
        startY: yPos,
        head: [['Cédula', 'Quantidade', 'Valor Unitário', 'Subtotal']],
        body: cedulasBRL.map(cedula => {
            const input = document.querySelector(`input[data-valor="${cedula.valor}"][data-symbol="R$"]`);
            const qtd = parseInt(input?.value) || 0;
            return [
                `R$ ${cedula.valor}`,
                qtd,
                `R$ ${cedula.valor.toFixed(2)}`,
                `R$ ${(qtd * cedula.valor).toFixed(2)}`
            ];
        })
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Cédulas ARS
    doc.setFontSize(16);
    doc.text("Cédulas em Pesos Argentinos (ARS):", 14, yPos);
    yPos += 10;
    
    doc.autoTable({
        startY: yPos,
        head: [['Cédula', 'Quantidade', 'Valor Unitário', 'Subtotal']],
        body: cedulasARS.map(cedula => {
            const input = document.querySelector(`input[data-valor="${cedula.valor}"][data-symbol="$"]`);
            const qtd = parseInt(input?.value) || 0;
            return [
                `$ ${cedula.valor}`,
                qtd,
                `$ ${cedula.valor.toFixed(2)}`,
                `$ ${(qtd * cedula.valor).toFixed(2)}`
            ];
        })
    });
    
    yPos = doc.lastAutoTable.finalY + 20;
    
    // Totais
    const totalBRL = parseFloat(document.getElementById('totalBRL').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
    const totalARS = parseFloat(document.getElementById('totalARS').textContent.replace('$ ', '').replace('.', '').replace(',', '.'));
    const cotacao = parseFloat(document.getElementById('exchangeRate').value) || 0.0058;
    const totalGeral = parseFloat(document.getElementById('totalGeral').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
    
    doc.setFontSize(14);
    doc.text("RESUMO FINAL", 105, yPos, { align: 'center' });
    yPos += 15;
    
    doc.setFontSize(12);
    doc.text(`Total em Reais: R$ ${totalBRL.toFixed(2).replace('.', ',')}`, 14, yPos);
    yPos += 10;
    doc.text(`Total em Pesos: $ ${totalARS.toFixed(2).replace('.', ',')}`, 14, yPos);
    yPos += 10;
    doc.text(`Cotação utilizada: 1 ARS = ${cotacao.toFixed(4)} BRL`, 14, yPos);
    yPos += 10;
    doc.text(`Total convertido: R$ ${(totalARS * cotacao).toFixed(2).replace('.', ',')}`, 14, yPos);
    yPos += 10;
    doc.text(`TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}`, 14, yPos);
    
    // Rodapé
    doc.setFontSize(10);
    doc.text("Relatório gerado automaticamente - Sistema de Controle de Caixa", 105, 280, { align: 'center' });
    
    // Salvar PDF
    doc.save(`relatorio-cedulas-${dataAtual.replace(/\//g, '-')}.pdf`);
}

// Limpar campos
function limparCampos() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        
    }
}