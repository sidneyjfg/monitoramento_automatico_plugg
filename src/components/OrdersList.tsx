import React, { useEffect, useState } from 'react';
import { fetchOrders, getDateRange } from '../services/api.ts';
import { sendNotification } from '../services/notification.ts'; // Função para enviar a notificação

interface Order {
  Order: {
    id: string;  // O ID do pedido está aqui dentro
    status: string;
    created: string;  // Adicione outras propriedades conforme necessário
    channel: string;
    approved_date: string;
    original_id: string;
    external: string | null;  // Pode ser string ou null
  }
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);  // Estado para armazenar os pedidos
  const [allOrdersValid, setAllOrdersValid] = useState<boolean>(false); // Estado para verificar se todos os pedidos têm external válido
  const [notificationInterval, setNotificationInterval] = useState<number | null>(null); // Armazenar o id do intervalo para poder limpar

  // Função para formatar a data no formato dd/MM/yyyy HH:mm:ss
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Função para iniciar o envio de notificação a cada 1 minuto
  const startNotificationTimer = (period: string) => {
    if (!notificationInterval) { // Verificar se o intervalo já está rodando
      const intervalId = setInterval(() => {
        sendNotification(`Todos os pedidos foram encontrados no nérus no período de ${period}`);
      }, 60000);  // 1 minuto = 60000 milissegundos
      setNotificationInterval(intervalId); // Armazenar o id do intervalo
    }
  };

  // Limpar o intervalo ao desmontar o componente
  useEffect(() => {
    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [notificationInterval]);

  // useEffect para buscar os pedidos assim que o componente é montado
  useEffect(() => {
    fetchOrders()
      .then((orders) => {
        console.log('Pedidos retornados pela API:', orders);
        setOrders(orders);  // Armazena os pedidos no estado

        // Verificar se todos os pedidos têm o campo "external" válido
        const allValid = orders.every((order) => order.Order.external);
        setAllOrdersValid(allValid);

        if (allValid) {
          // Obter o período buscado a partir do getDateRange()
          const { from, to } = getDateRange();  // Função já implementada anteriormente
          const period = `${formatDate(from)} até ${formatDate(to)}`; // Formatar o período corretamente
          
          // Iniciar envio de notificação a cada 1 minuto
          startNotificationTimer(period);
        }
      })
      .catch((error) => console.error('Erro ao buscar pedidos:', error));  // Lida com erros da API
  }, []);  // O array vazio [] faz com que o useEffect rode apenas quando o componente for montado

  return (
    <div>
      <h2>Lista de Pedidos</h2>
      <ul>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <li key={index}>
              <strong>Id: {order.Order.id}</strong> <br />
              Marketplace: {order.Order.channel || 'N/A'} <br />
              Data de Aprovação: {order.Order.approved_date ? formatDate(order.Order.approved_date) : 'N/A'} <br />
              Pedido: {order.Order.original_id || 'N/A'} <br />
              IdNérus: {order.Order.external || 'N/A'}
            </li>
          ))
        ) : (
          <li>Nenhum pedido encontrado</li>
        )}
      </ul>
    </div>
  );
};

export default OrderList;
