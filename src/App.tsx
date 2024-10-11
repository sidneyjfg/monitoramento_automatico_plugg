import React from 'react';
import OrderList from './components/OrdersList.tsx';  // Importa o componente que exibe os pedidos

function App() {
  return (
    <div className="App">
      <h1>Monitoramento de Pedidos</h1>
      <OrderList />  {/* Exibe a lista de pedidos */}
    </div>
  );
}

export default App;
