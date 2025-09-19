const express = require('express');
const config = require('./src/config/config');
const uploadRoutes = require('./src/routes/upload');
const disableCors = require('./src/middleware/corsMiddleware');

const app = express();

app.use(disableCors);

app.use('/api', uploadRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(config.server.port, () => {
    console.log(`API rodando na porta ${config.server.port}`);
});