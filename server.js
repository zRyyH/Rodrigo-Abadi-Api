const disableCors = require('./src/middleware/corsMiddleware');
const uploadRoutes = require('./src/routes/upload');
const { api } = require('./src/constants/config');
const express = require('express');

const app = express();

app.use(disableCors);
app.use(express.json());

app.use('/api', uploadRoutes);

app.listen(api.port, () => {
    console.log(`🚀 Servidor rodando na porta ${api.port}`);
});