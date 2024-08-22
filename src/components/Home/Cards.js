import React, { useState, useEffect } from "react";
import CardsModulo from "../CardsModulo"; // Certifique-se de que o caminho está correto
import axios from "axios";
import Modal from "../Modal"; // Certifique-se de que o caminho está correto

const Cards = ({ showModal, setShowModal }) => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false); // Estado para forçar a atualização

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/get-data");
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]); // Atualiza os dados quando o estado 'refresh' muda

  const handleRefresh = () => {
    console.log("handleRefresh chamado"); // Log para depuração
    setRefresh(!refresh); // Alterna o estado para forçar a atualização
  };

  return (
    <div className="h-auto p-4 relative overflow-hidden">
      <h1 className="text-xl font-bold mb-4 text-center text-white">
        Lista de Horários
      </h1>
      <div>
        <CardsModulo data={data} />
      </div>
      {showModal && (
        <Modal
          closeModal={() => setShowModal(false)}
          date={new Date().toISOString().split("T")[0]} // Exemplo de data
          onSave={handleRefresh} // Passa a função handleRefresh para o Modal
        />
      )}
    </div>
  );
};

export default Cards;
