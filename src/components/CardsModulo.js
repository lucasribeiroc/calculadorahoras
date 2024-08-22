import React, { useState, useRef } from "react";
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
  Alert,
  AlertIcon,
  Stack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, CalendarIcon, TimeIcon } from "@chakra-ui/icons"; // Importe os ícones DeleteIcon, EditIcon, CalendarIcon e TimeIcon

const CardsModulo = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [dateToDelete, setDateToDelete] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Estado para controlar a exibição do alerta de sucesso
  const cancelRef = useRef();

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
      setShowSuccessAlert(true); // Mostrar o alerta de sucesso
      setTimeout(() => setShowSuccessAlert(false), 3000); // Ocultar o alerta após 3 segundos
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

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4} p={4}>
      {showSuccessAlert && (
        <Box
          position="fixed"
          bottom="4"
          left="50%"
          transform="translateX(-50%)"
          zIndex="1000"
        >
          <Stack spacing={3}>
            <Alert status="success">
              <AlertIcon />
              Registro excluído com sucesso!
            </Alert>
          </Stack>
        </Box>
      )}
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
