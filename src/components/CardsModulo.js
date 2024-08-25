import React, { useState, useRef, useEffect } from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Stack,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  CalendarIcon,
  TimeIcon,
  CheckIcon,
} from "@chakra-ui/icons"; // Importe os ícones DeleteIcon, EditIcon, CalendarIcon, TimeIcon e CheckIcon

const CardsModulo = ({ data, setDaysData, onDeleteSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [dateToDelete, setDateToDelete] = useState(null);
  const [totalMonthlyHours, setTotalMonthlyHours] = useState(0);
  const cancelRef = useRef();
  const valorHora = 25.0;

  useEffect(() => {
    calculateTotalMonthlyHours();
  }, [data]);

  const calculateTotalMonthlyHours = async () => {
    const totalHours = data.reduce((total, dayData) => {
      return total + dayData.totalHours;
    }, 0);
    setTotalMonthlyHours(totalHours);

    // Atualizar as horas totais do mês no backend
    const [year, month] = data[0]?.date.split("-") || [
      new Date().getFullYear(),
      new Date().getMonth() + 1,
    ];
    try {
      await axios.post("http://localhost:3001/api/update-monthly-total-hours", {
        year,
        month,
        totalHours,
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar as horas totais do mês no backend:",
        error
      );
    }
  };

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
      await axios.post("http://localhost:3001/api/save-times", updatedData);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  const handleDelete = async () => {
    setIsAlertOpen(false); // Fechar o AlertDialog imediatamente
    try {
      await axios.delete("http://localhost:3001/api/delete-times", {
        data: { date: dateToDelete },
      });
      // Atualize os dados localmente após a exclusão
      setDaysData((prevData) =>
        prevData.filter((day) => day.date !== dateToDelete)
      );
      onDeleteSuccess(); // Chama a função de callback para exibir o alerta de sucesso
    } catch (error) {
      console.error("Erro ao excluir os dados:", error);
    }
  };

  const openAlertDialog = (date) => {
    setDateToDelete(date);
    setIsAlertOpen(true);
  };

  const closeAlertDialog = () => {
    setIsAlertOpen(false);
    setDateToDelete(null);
  };

  const getMonthName = (dateString) => {
    const date = parseISO(dateString);
    return (
      format(date, "MMMM", { locale: ptBR }).charAt(0).toUpperCase() +
      format(date, "MMMM", { locale: ptBR }).slice(1)
    );
  };

  const calculateTotalToReceive = (hours, rate) => {
    return (hours * rate).toFixed(2);
  };

  return (
    <Grid templateRows="auto 1fr" gap={4} p={4}>
      <Flex justifyContent="center" gap={8} mb={8}>
        <Box
          border="1px solid white" // Borda branca de 1px
          p={4}
          rounded="lg"
          shadow="md"
          transition="shadow 0.3s"
          color="white" // Cor da fonte branca
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.6)" // Sombra preta mais escura e mais distante
          textAlign="center"
        >
          <Stat>
            <StatLabel fontSize="xl" textAlign="center">
              Total de Horas {getMonthName(data[0]?.date)}
            </StatLabel>
            <StatNumber fontSize="5xl" textAlign="center">
              {formatHours(totalMonthlyHours)}
            </StatNumber>
            <StatHelpText
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TimeIcon mr={2} />
              Horas trabalhadas
            </StatHelpText>
          </Stat>
        </Box>
        <Box
          border="1px solid white" // Borda branca de 1px
          p={4}
          rounded="lg"
          shadow="md"
          transition="shadow 0.3s"
          color="white" // Cor da fonte branca
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.6)" // Sombra preta mais escura e mais distante
          textAlign="center"
        >
          <Stat>
            <StatLabel
              fontSize="xl"
              style={{ whiteSpace: "nowrap" }}
              textAlign="center"
            >
              Total a receber em {getMonthName(data[0]?.date)}
            </StatLabel>
            <StatNumber fontSize="5xl" textAlign="center">
              R$ {calculateTotalToReceive(totalMonthlyHours, valorHora)}
            </StatNumber>
            <StatHelpText
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CheckIcon mr={2} />
              Valor Hora: R$ {valorHora.toFixed(2)}
            </StatHelpText>
          </Stat>
        </Box>
      </Flex>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
        {data.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            Nenhum dado disponível
          </Text>
        ) : (
          data.map((dayData) => (
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
                      openAlertDialog(dayData.date);
                    }}
                  />
                </Flex>
              </Flex>
            </Box>
          ))
        )}
      </Grid>
      {isModalOpen && (
        <Modal
          closeModal={handleCloseModal}
          date={selectedDate}
          onSave={handleSave} // Passa o callback para o Modal
        />
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlertDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Exclusão
            </AlertDialogHeader>

            <AlertDialogBody>
              Você tem certeza que deseja excluir este registro? Esta ação não
              pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlertDialog}>
                Não
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Grid>
  );
};

export default CardsModulo;
