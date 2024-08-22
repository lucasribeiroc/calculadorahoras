import Head from "next/head";
import Calendar from "../Calendar";
import { Box, Center, Text } from "@chakra-ui/react";

export default function Calc() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      pt={8} // Aumentando o padding top
      pb={8} // Aumentando o padding bottom
    >
      <Head>
        <title>Calculadora de Horas</title>
      </Head>
      <Center zIndex={1} mb={4}>
        <Text
          as="h4"
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          color="white"
        >
          Clique na data desejada para lançar suas horas
        </Text>
      </Center>
      <Center zIndex={1}>
        <Box
          borderRadius="md"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.5)" // Adicionando uma sombra forte
          display="inline-block" // Ajustando o tamanho ao conteúdo
        >
          <Calendar />
        </Box>
      </Center>
    </Box>
  );
}
