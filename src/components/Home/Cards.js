import React, { useState, useEffect } from "react";
import CardsModulo from "../CardsModulo"; // Certifique-se de que o caminho está correto
import axios from "axios";
import { Box, Alert, AlertIcon, Stack } from "@chakra-ui/react";

const Cards = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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

  const handleDeleteSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000); // Ocultar o alerta após 3 segundos
  };

  return (
    <div className="h-auto p-4 relative overflow-hidden">
      <h1 className="text-xl font-bold mb-4 text-center text-white">
        Lista de Horários
      </h1>
      {showSuccessAlert && (
        <Box position="fixed" bottom="20px" left="20px" zIndex="1000">
          <Stack spacing={3}>
            <Alert status="success">
              <AlertIcon />
              Registro excluído com sucesso!
            </Alert>
          </Stack>
        </Box>
      )}
      <div>
        <CardsModulo
          data={data}
          setDaysData={setData}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  );
};

export default Cards;
