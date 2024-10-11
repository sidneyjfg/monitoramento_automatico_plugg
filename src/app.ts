import cron from 'node-cron';
import { fetchOrders } from './services/api';  // Função que busca os pedidos
import { sendNotification } from './services/notification';  // Função para enviar notificações

// Lê o CRON_SCHEDULE das variáveis de ambiente
const cronSchedule = process.env.CRON_SCHEDULE || '0 0 * * *';  // Valor padrão: executar diariamente à meia-noite

// Função para executar a busca e notificação
async function runJob() {
  console.log('Iniciando a busca de pedidos...');
  const orders = await fetchOrders();
  
  if (orders.length > 0) {
    console.log('Pedidos encontrados, notificando...');
    // Notifica aqui após a busca (pode ser ajustado conforme necessário)
    sendNotification('Busca de pedidos realizada com sucesso.');
  } else {
    console.log('Nenhum pedido encontrado.');
  }
}

// Agendamento da tarefa com base no CRON_SCHEDULE
cron.schedule(cronSchedule, async () => {
  console.log(`Executando tarefa conforme o cron: ${cronSchedule}`);
  await runJob();  // Executa a função que faz a busca e envia notificações
});

// Manter o processo rodando (apenas em ambientes onde necessário)
console.log('Agendador configurado e pronto para executar tarefas.');
