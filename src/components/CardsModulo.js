import React, { useEffect, useState } from "react";
import axios from "axios";

const CardsModulo = () => {
  const [daysData, setDaysData] = useState([]);

  useEffect(() => {
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
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {daysData.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum dado disponível</p>
      ) : (
        daysData.map((dayData) => (
          <div
            key={dayData.date}
            className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {dayData.date}
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              Total de Horas: {dayData.totalHours.toFixed(2)}
            </p>
            <ul className="list-disc list-inside">
              {dayData.times.map((time, index) => (
                <li key={index} className="text-gray-700">
                  Entrada: {time.entrada}, Saída: {time.saida}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default CardsModulo;
