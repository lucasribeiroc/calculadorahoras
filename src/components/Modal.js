import { useState, useEffect } from "react";
import axios from "axios";
import { Alert, AlertIcon, Stack, CloseButton } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const Modal = ({ closeModal, date, onSave }) => {
  const [times, setTimes] = useState(
    Array.from({ length: 5 }, () => ({
      entrada: "",
      saida: "",
    }))
  );
  const [error, setError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

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
        setError("Erro ao buscar os horários. Tente novamente.");
        setShowErrorAlert(true);
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
    if (totalHours <= 0) {
      setError("Por favor, insira horários válidos.");
      setShowErrorAlert(true);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/api/save-times",
        {
          date,
          times,
          totalHours,
        }
      );
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        closeModal();
        if (typeof onSave === "function") {
          console.log("onSave callback chamado"); // Log para depuração
          onSave(); // Chama o callback para notificar o componente pai
        }
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar os horários no backend:", error);
      setError("Erro ao salvar os horários. Tente novamente.");
      setShowErrorAlert(true);
    }
  };

  const handleTimeChange = (index, type, value) => {
    const newTimes = [...times];
    newTimes[index][type] = value;
    setTimes(newTimes);
    setError(""); // Limpa a mensagem de erro ao alterar os horários
    setShowErrorAlert(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 9999, backdropFilter: "blur(5px)" }}
    >
      <div
        className="relative p-4 rounded shadow-lg w-full max-w-md"
        style={{ backgroundColor: "#4682B4", border: "1px solid white" }}
      >
        <div className="relative p-4 rounded">
          <CloseButton
            size="sm"
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
            }}
          />
          <h2 className="text-center text-xl mb-4 text-white">
            Lance suas horas
          </h2>
          <p className="text-center mb-4 text-white">{date}</p>
          {showErrorAlert && (
            <Stack spacing={3} className="mb-4">
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            </Stack>
          )}
          {showSuccessAlert && (
            <Alert status="success" className="mb-4">
              <AlertIcon />
              Horários salvos com sucesso!
            </Alert>
          )}
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
          <div className="text-center mt-4 flex justify-center">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 border border-white w-full flex items-center justify-center"
            >
              <CheckIcon className="mr-2" />
              <span className="font-bold">Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
