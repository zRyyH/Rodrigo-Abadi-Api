const config = require('../constants/config');
const { logger, logResult } = require('../config/logger');
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

            logger.info(`[RabbitMQ] Conectando em ${host}:${port}...`);
            this.connection = await amqp.connect(url);

            // eventos de conexão
            this.connection.on('error', (err) => {
                logger.error(`[RabbitMQ] Connection error: ${err.message}`);
            });

            this.connection.on('close', () => {
                logger.warn('[RabbitMQ] Conexão fechada. Reconectando em 5s...');
                setTimeout(() => this.connect(), 5000);
            });

            this.channel = await this.connection.createChannel();

            // eventos do canal
            this.channel.on('error', (err) => {
                logger.error(`[RabbitMQ] Channel error: ${err.message}`);
            });

            this.channel.on('close', () => {
                logger.warn('[RabbitMQ] Canal fechado');
            });

            await this.channel.assertQueue(config.rabbitmq.queue, { durable: true });

            logResult('RabbitMQ conectado', `Queue: ${config.rabbitmq.queue}`);
        } catch (error) {
            logger.error(`[RabbitMQ] Falha na conexão: ${error.message}`);
            logger.warn('[RabbitMQ] Reconectando em 5s...');
            setTimeout(() => this.connect(), 5000);
        } finally {
            this.isConnecting = false;
        }
    }

    async sendToQueue(data) {
        try {
            if (!this.channel) {
                logger.info('[RabbitMQ] Canal não disponível, conectando...');
                await this.connect();
            }

            const message = Buffer.from(JSON.stringify(data));
            const messageSize = (message.length / 1024).toFixed(2);

            const sent = this.channel.sendToQueue(
                config.rabbitmq.queue,
                message,
                { persistent: true }
            );

            if (!sent) {
                logger.warn('[RabbitMQ] Buffer cheio, mensagem pode não ter sido enviada');
            } else {
                logResult('Mensagem enviada para fila', `${messageSize} KB`);
            }

            return true;
        } catch (error) {
            logger.error(`[RabbitMQ] Falha ao enviar mensagem: ${error.message}`);
            logger.warn('[RabbitMQ] Reconectando e reenviando...');
            await this.connect();
            return this.sendToQueue(data);
        }
    }

    async close() {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            logger.info('[RabbitMQ] Conexão fechada');
        } catch (error) {
            logger.error(`[RabbitMQ] Erro ao fechar conexão: ${error.message}`);
        }
    }
}

module.exports = new RabbitMQService();