import { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ closeModal, date }) => {
  const [times, setTimes] = useState(
    Array.from({ length: 5 }, () => ({
      entrada: "",
      saida: "",
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/get-times",
          {
            params: { date },
          }
        );
        setTimes(response.data.times);
      } catch (error) {
        console.error("Erro ao buscar os horários do backend:", error);
      }
    };

    fetchData();
  }, [date]);

  const calculateTotalHours = () => {
    let totalHours = 0;
    times.forEach((time) => {
      if (time.entrada && time.saida) {
        const entrada = new Date(`1970-01-01T${time.entrada}:00`);
        const saida = new Date(`1970-01-01T${time.saida}:00`);
        if (!isNaN(entrada) && !isNaN(saida)) {
          const diff = (saida - entrada) / (1000 * 60 * 60);
          totalHours += diff;
        }
      }
    });
    return totalHours;
  };

  const handleSave = async () => {
    const totalHours = calculateTotalHours();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/save-times",
        {
          date,
          times,
          totalHours,
        }
      );
      alert("Horários salvos com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar os horários no backend:", error);
      alert("Erro ao salvar os horários. Tente novamente.");
    }
  };

  const handleTimeChange = (index, type, value) => {
    const newTimes = [...times];
    newTimes[index][type] = value;
    setTimes(newTimes);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl mb-4 text-black">
          Lance suas horas
        </h2>
        <p className="text-center mb-4 text-black">{date}</p>
        <div className="space-y-2">
          {times.map((time, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="time"
                value={time.entrada}
                onChange={(e) =>
                  handleTimeChange(index, "entrada", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded text-black"
              />
              <input
                type="time"
                value={time.saida}
                onChange={(e) =>
                  handleTimeChange(index, "saida", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded text-black"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-4 flex justify-center space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Fechar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
