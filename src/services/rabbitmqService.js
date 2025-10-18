const config = require('../constants/config');
const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.isConnecting = false;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        if (this.isConnecting) return;
        this.isConnecting = true;

        try {
            const { host, port, user, pass } = config.rabbitmq;
            const url = `amqp://${user}:${pass}@${host}:${port}`;

            this.connection = await amqp.connect(url);

            // eventos de conexão
            this.connection.on('error', (err) => {
                console.error('❌ Connection error:', err);
            });

            this.connection.on('close', () => {
                console.warn('⚠️ Conexão fechada. Tentando reconectar em 5s...');
                setTimeout(() => this.connect(), 5000);
            });

            this.channel = await this.connection.createChannel();

            // eventos do canal
            this.channel.on('error', (err) => {
                console.error('❌ Channel error:', err);
            });

            this.channel.on('close', () => {
                console.warn('⚠️ Canal fechado.');
            });

            await this.channel.assertQueue(config.rabbitmq.queue, { durable: true });

            console.log('✅ Conectado ao RabbitMQ');
        } catch (error) {
            console.error('❌ Erro ao conectar ao RabbitMQ:', error);
            console.warn('⚠️ Tentando reconectar em 5s...');
            setTimeout(() => this.connect(), 5000);
        } finally {
            this.isConnecting = false;
        }
    }

    async sendToQueue(data) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            const message = Buffer.from(JSON.stringify(data));

            const sent = this.channel.sendToQueue(
                config.rabbitmq.queue,
                message,
                { persistent: true }
            );

            if (!sent) {
                console.warn('⚠️ Buffer cheio. Mensagem pode não ter sido enviada.');
            }

            console.log('✅ Mensagem enviada para fila');
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar para fila:', error);
            console.warn('⚠️ Tentando reconectar e reenviar...');
            await this.connect();
            return this.sendToQueue(data); // tenta reenviar
        }
    }

    async close() {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log('✅ Conexão RabbitMQ fechada');
        } catch (error) {
            console.error('❌ Erro ao fechar conexão:', error);
        }
    }
}

module.exports = new RabbitMQService();
