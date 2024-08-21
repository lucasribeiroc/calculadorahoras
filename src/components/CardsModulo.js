import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Modal from "./Modal"; // Importe o Modal

const CardsModulo = () => {
  const [daysData, setDaysData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/load");
      console.log("Dados recebidos do backend:", response.data);
      const days = response.data;
      console.log("Dados processados:", days);
      setDaysData(days);
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatHours = (decimalHours) => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleOpenModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSave = async (updatedData) => {
    try {
      // Supondo que você tenha uma rota para salvar os dados
      await axios.post("http://localhost:3001/save", updatedData);
      fetchData(); // Atualiza os dados após salvar
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  const handleDelete = async (date) => {
    try {
      await axios.delete("http://localhost:3001/api/delete-times", {
        data: { date },
      });
      setDaysData((prevData) => prevData.filter((day) => day.date !== date));
    } catch (error) {
      console.error("Erro ao excluir os dados:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {daysData.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum dado disponível</p>
      ) : (
        daysData.map((dayData) => (
          <div
            key={dayData.date}
            className="relative bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <button
              className="absolute top-2 right-4 text-red-500" // Alterado de right-2 para right-4
              onClick={() => handleDelete(dayData.date)}
            >
              X
            </button>
            <div onClick={() => handleOpenModal(dayData.date)}>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {formatDate(dayData.date)}
              </h3>
              {dayData.times.map((time, index) => (
                <div key={index} className="text-gray-700">
                  {time.entrada && <p>Entrada: {time.entrada}</p>}
                  {time.saida && <p>Saída: {time.saida}</p>}
                </div>
              ))}
              <p className="text-lg text-gray-600 mt-4">
                Total de Horas: {formatHours(dayData.totalHours)}
              </p>
            </div>
          </div>
        ))
      )}
      {isModalOpen && (
        <Modal
          closeModal={handleCloseModal}
          date={selectedDate}
          onSave={handleSave} // Passa o callback para o Modal
        />
      )}
    </div>
  );
};

export default CardsModulo;
