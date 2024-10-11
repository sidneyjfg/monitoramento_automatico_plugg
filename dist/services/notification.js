"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const axios_1 = __importDefault(require("axios"));
// Função para enviar a notificação via Google Chat Webhook
function sendNotification(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL; // Usar a variável de ambiente para o webhook
            if (!webhookUrl) {
                console.error('Erro: Variável de ambiente GOOGLE_CHAT_WEBHOOK_URL não definida.');
                return;
            }
            // Fazer a requisição POST para o Google Chat Webhook
            const response = yield axios_1.default.post(webhookUrl, { text: message }, // Corpo da mensagem no formato esperado
            {
                headers: {
                    'Content-Type': 'application/json', // Cabeçalho necessário para a API
                },
            });
            console.log('Notificação enviada com sucesso:', response.data);
        }
        catch (error) {
            // Tratamento de erro no envio de notificação
            console.error('Erro ao enviar notificação:', error.message);
            if (error.response) {
                // Exibir detalhes da resposta, se disponível
                console.error('Resposta da API:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            }
            else if (error.request) {
                // Se a requisição foi feita mas não houve resposta
                console.error('Nenhuma resposta recebida:', error.request);
            }
            else {
                // Algum erro aconteceu na configuração da requisição
                console.error('Erro durante a configuração da requisição:', error.message);
            }
        }
    });
}
exports.sendNotification = sendNotification;
