import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Modal from "./Modal"; // Importe o Modal
import { darken } from "polished"; // Importe a função darken
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  IconButton,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, CalendarIcon, TimeIcon } from "@chakra-ui/icons"; // Importe os ícones DeleteIcon, EditIcon, CalendarIcon e TimeIcon

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
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4} p={4}>
      {daysData.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          Nenhum dado disponível
        </Text>
      ) : (
        daysData.map((dayData) => (
          <Box
            key={dayData.date}
            border="1px solid white" // Borda branca de 1px
            p={4}
            rounded="lg"
            shadow="md"
            transition="shadow 0.3s"
            color="white" // Cor da fonte branca
            boxShadow="0 8px 16px rgba(0, 0, 0, 0.6)" // Sombra preta mais escura e mais distante
            display="flex"
            flexDirection="column"
          >
            {/* Header */}
            <Box mb={2} display="flex" alignItems="center">
              <CalendarIcon color="white" mr={2} />
              <Heading as="h3" size="md" color="white">
                {formatDate(dayData.date)}
              </Heading>
            </Box>
            <Divider borderColor="white" my={2} /> {/* Margem vertical */}
            {/* Body */}
            <Box mb={4}>
              {dayData.times.map((time, index) => (
                <Text key={index} color="white">
                  {time.entrada && (
                    <Flex alignItems="center">
                      <TimeIcon color="white" mr={2} />
                      <p>Entrada: {time.entrada}</p>
                    </Flex>
                  )}
                  {time.saida && (
                    <Flex alignItems="center">
                      <TimeIcon color="white" mr={2} />
                      <p>Saída: {time.saida}</p>
                    </Flex>
                  )}
                </Text>
              ))}
            </Box>
            <Divider borderColor="white" mt="auto" mb={2} />{" "}
            {/* Margem vertical */}
            {/* Footer */}
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <TimeIcon color="white" mr={2} />
                <Text fontSize="md" color="white">
                  Total de Horas: {formatHours(dayData.totalHours)}
                </Text>
              </Flex>
              <Flex gap={2}>
                <IconButton
                  colorScheme="blue"
                  size="sm"
                  icon={<EditIcon />}
                  border="1px solid white" // Borda branca de 1px
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(dayData.date);
                  }}
                />
                <IconButton
                  colorScheme="red"
                  size="sm"
                  icon={<DeleteIcon />}
                  border="1px solid white" // Borda branca de 1px
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(dayData.date);
                  }}
                />
              </Flex>
            </Flex>
          </Box>
        ))
      )}
      {isModalOpen && (
        <Modal
          closeModal={handleCloseModal}
          date={selectedDate}
          onSave={handleSave} // Passa o callback para o Modal
        />
      )}
    </Grid>
  );
};

export default CardsModulo;
