import axios from 'axios';

export async function sendNotification(message: string) {
  try {
    const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL; // Usar a variável de ambiente para o webhook

    if (!webhookUrl) {
      console.error('Erro: Variável de ambiente GOOGLE_CHAT_WEBHOOK_URL não definida.');
      return;
    }

    const response = await axios.post(webhookUrl, {
      text: message,  // Corpo da mensagem no formato esperado
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Notificação enviada com sucesso:', response.data);
  } catch (error) {
    // Tratamento de erro no envio de notificação
    console.error('Erro ao enviar notificação:', error.message);

    if (error.response) {
      // Exibir detalhes da resposta, se disponível
      console.error('Resposta da API:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Se a requisição foi feita mas não houve resposta
      console.error('Nenhuma resposta recebida:', error.request);
    } else {
      // Algum erro aconteceu na configuração da requisição
      console.error('Erro durante a configuração da requisição:', error.message);
    }
  }
}
