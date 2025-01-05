import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PedidoForm = () => {
  const [fecha, setFecha] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');
  const [numeroDeposito, setNumeroDeposito] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fecha && numeroPedido && numeroDeposito) {
      try {
        const formData = new FormData();
        formData.append('entry.1875761660', fecha); // Campo de Fecha
        formData.append('entry.1483588992', numeroPedido); // Campo de Número de Pedido
        formData.append('entry.1338402881', numeroDeposito); // Campo de Número de Depósito

        await fetch('https://docs.google.com/forms/d/e/1FAIpQLScrS-FzHZBphV4EPEbUBrHs2lnPm_ndm_OTjhW22kcxqD2dBw/formResponse', {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        });

        setEnviado(true);
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al enviar el pedido.');
      }
    } else {
      alert('Por favor completa todos los campos.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Formulario de Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
            Fecha
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroPedido">
            Número de Pedido
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numeroPedido"
            type="text"
            value={numeroPedido}
            onChange={(e) => setNumeroPedido(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroDeposito">
            Número de Depósito
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numeroDeposito"
            type="text"
            value={numeroDeposito}
            onChange={(e) => setNumeroDeposito(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Cargar Pedido
        </button>
        {enviado && (
          <div className="mt-4">
            <Check className="text-green-500" />
            <span className="text-green-500 font-bold">Pedido enviado con éxito</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default PedidoForm;
