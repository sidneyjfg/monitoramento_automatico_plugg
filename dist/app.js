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
const node_cron_1 = __importDefault(require("node-cron"));
const api_1 = require("./services/api"); // Função que busca os pedidos
const notification_1 = require("./services/notification"); // Função para enviar notificações
// Lê o CRON_SCHEDULE das variáveis de ambiente
const cronSchedule = process.env.CRON_SCHEDULE || '0 0 * * *'; // Valor padrão: executar diariamente à meia-noite
// Função para executar a busca e notificação
function runJob() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Iniciando a busca de pedidos...');
        const orders = yield (0, api_1.fetchOrders)();
        if (orders.length > 0) {
            console.log('Pedidos encontrados, notificando...');
            // Notifica aqui após a busca (pode ser ajustado conforme necessário)
            (0, notification_1.sendNotification)('Busca de pedidos realizada com sucesso.');
        }
        else {
            console.log('Nenhum pedido encontrado.');
        }
    });
}
// Agendamento da tarefa com base no CRON_SCHEDULE
node_cron_1.default.schedule(cronSchedule, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Executando tarefa conforme o cron: ${cronSchedule}`);
    yield runJob(); // Executa a função que faz a busca e envia notificações
}));
// Manter o processo rodando (apenas em ambientes onde necessário)
console.log('Agendador configurado e pronto para executar tarefas.');
