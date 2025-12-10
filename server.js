const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/relatorio', (req, res) => {
    res.sendFile(path.join(__dirname, 'relatorio.html'));
});

// API para salvar dados (opcional)
app.post('/api/save-report', (req, res) => {
    const reportData = req.body;
    // Aqui você pode salvar no banco de dados
    console.log('Relatório recebido:', reportData);
    res.json({ success: true, message: 'Relatório salvo com sucesso!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`🔑 Código de acesso padrão: 123456`);
});



// npm install netlify-cli -g
// netlify deploy --prod