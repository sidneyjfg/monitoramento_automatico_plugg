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
exports.fetchOrders = exports.getDateRange = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("./auth"); // Função para obter o token
const notification_1 = require("./notification"); // Função para enviar a notificação
// Função para obter o dia anterior e o dia atual no formato correto
function getDateRange() {
    const today = new Date();
    // Pegar o valor de `days_to_fetch` da variável de ambiente, com um valor padrão de 1 se não for definido
    const daysToFetch = parseInt(process.env.DAYS_TO_FETCH || '1', 10);
    const previousDay = new Date(today);
    // Subtrair a quantidade de dias especificada por `days_to_fetch`
    previousDay.setDate(today.getDate() - daysToFetch);
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    return {
        from: formatDate(previousDay),
        to: formatDate(today), // Data atual
    };
}
exports.getDateRange = getDateRange;
// Função para buscar pedidos com paginação e autenticação
function fetchOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = process.env.PLUGGTO_URL; // Variável de ambiente para a URL da API
        const { from, to } = getDateRange(); // Obter o intervalo de datas dinâmico (dia anterior e dia atual)
        let allOrders = []; // Array para armazenar todos os pedidos
        let next = null; // Variável para controlar a paginação
        let token = null;
        try {
            // Tentar obter o token de acesso
            token = yield (0, auth_1.getAccessToken)();
            if (!token) {
                console.error('Falha ao obter o token de acesso.');
                return [];
            }
            do {
                // Definir os parâmetros da requisição
                const params = {
                    limit: 100,
                    created: `${from}to${to}`,
                    next: next || undefined, // Passar o `next` para a próxima página, se existir
                };
                // Fazer a requisição para a API
                const response = yield axios_1.default.get(`${apiUrl}/orders`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    params: params,
                });
                const orders = response.data.result || [];
                allOrders = [...allOrders, ...orders]; // Adicionar pedidos ao array principal
                // Atualizar o valor de `next` com o ID do último pedido retornado
                if (orders.length > 0) {
                    next = orders[orders.length - 1].Order.id; // Pega o ID do último pedido de forma aninhada
                }
                else {
                    next = null; // Se não houver mais pedidos, parar a paginação
                }
                console.log('Pedidos buscados com sucesso nesta página:', orders);
            } while (next); // Continuar enquanto houver um valor de `next`
            // Verificar se algum pedido não foi integrado (ou seja, não tem o campo `external`)
            const nonIntegratedOrders = allOrders.filter(order => !order.Order.external);
            // Formatar a string para o período de busca com base nas datas `from` e `to`
            const searchPeriod = `Período de busca: ${from} até ${to}`;
            if (nonIntegratedOrders.length > 0) {
                // Se houver pedidos não integrados, enviar notificação com detalhes
                let message = `Foram encontrados ${nonIntegratedOrders.length} pedidos sem integração (sem IdNérus):\n`;
                nonIntegratedOrders.forEach(order => {
                    message += `ID: ${order.Order.id},\n Pedido: ${order.Order.original_id}, \nCanal: ${order.Order.channel}\n`;
                });
                message += `\n${searchPeriod}`; // Inclui o período de busca correto
                // Enviar notificação com a lista de pedidos não integrados
                yield (0, notification_1.sendNotification)(message);
            }
            else {
                // Se todos os pedidos foram integrados, enviar notificação de sucesso
                const successMessage = `Todos os pedidos foram encontrados no Nérus e integrados corretamente.\n${searchPeriod}`;
                yield (0, notification_1.sendNotification)(successMessage);
            }
            return allOrders; // Retorna a lista de todos os pedidos
        }
        catch (error) {
            // Se houver erro, capturamos os detalhes
            console.error('Erro ao buscar pedidos:', error.message);
            if (error.response) {
                // Exibir detalhes da resposta da API, se disponível
                console.error('Resposta da API:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            }
            else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Nenhuma resposta recebida:', error.request);
            }
            else {
                // Algum erro aconteceu na configuração da requisição
                console.error('Erro durante a configuração da requisição:', error.message);
            }
            return []; // Retorna um array vazio em caso de erro
        }
    });
}
exports.fetchOrders = fetchOrders;
