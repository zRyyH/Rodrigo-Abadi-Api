const express = require('express');
const disableCors = require('./src/middleware/corsMiddleware');
const uploadRoutes = require('./src/routes/upload');
const sqlRoutes = require('./src/routes/query');
const { server } = require('./src/config/config');

const app = express();

app.use(disableCors);
app.use(express.json());

app.use('/api', uploadRoutes);
app.use('/api/query', sqlRoutes);

app.listen(server.port, () => {
    console.log(`🚀 Servidor rodando na porta ${server.port}`);
});