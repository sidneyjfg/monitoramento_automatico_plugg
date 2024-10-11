import axios from 'axios';

// Função para obter o token de acesso usando variáveis de ambiente
export async function getAccessToken() {
    const client_id = process.env.PLUGGTO_CLIENT_ID;
    const client_secret = process.env.PLUGGTO_CLIENT_SECRET;
    const username = process.env.PLUGGTO_USERNAME;
    const password = process.env.PLUGGTO_PASSWORD;
    const apiUrl = process.env.PLUGGTO_URL || 'https://api.plugg.to';
  
    const url = `${apiUrl}/oauth/token`;
    const data = new URLSearchParams({
      grant_type: 'password',
      client_id: client_id as string,
      client_secret: client_secret as string,
      username: username as string,
      password: password as string,
    });
  
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      return response.data.access_token;  // Retorna o token de acesso
    } catch (error) {
      console.error('Erro ao obter token de acesso:', error);
      return null;
    }
  }