import React, { useState, useEffect } from "react";
import CardsModulo from "../CardsModulo"; // Certifique-se de que o caminho está correto
import axios from "axios";

const Cards = ({ refresh }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const url = "http://localhost:3001/load";
    console.log("Chamando a URL:", url); // Log para verificar a URL
    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log("Dados atualizados:", response.data); // Log para depuração
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]); // Atualiza os dados quando o estado 'refresh' muda

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Verifica atualizações a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  return (
    <div className="h-auto p-4 relative overflow-hidden">
      <h1 className="text-xl font-bold mb-4 text-center text-white">
        Lista de Horários
      </h1>
      <div>
        <CardsModulo data={data} />
      </div>
    </div>
  );
};

export default Cards;
