import React from "react";
import CardsModulo from "../CardsModulo"; // Certifique-se de que o caminho está correto

const Cards = () => {
  return (
    <div className="bg-gray-500 h-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Lista de Horários</h1>
      <CardsModulo />
    </div>
  );
};

export default Cards;
