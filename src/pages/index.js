import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Home/Header";
import Calc from "../components/Home/Calc";
import Cards from "../components/Home/Cards";

// Carregar ParticlesBg dinamicamente com ssr desativado
const ParticlesBg = dynamic(() => import("particles-bg"), { ssr: false });

const Index = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundColor: "#4682B4", // Azul mais escuro
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
      {isClient && (
        <ParticlesBg
          type="custom"
          config={{
            num: [2, 4],
            rps: 0.1,
            radius: [200, 400],
            life: [1.5, 3],
            v: [0.5, 1],
            tha: [-40, 40],
            alpha: [0.6, 0],
            scale: [0.1, 0.4],
            position: "all",
            color: ["#1E90FF", "#00BFFF", "#87CEFA", "#4682B4"], // Tons de azul
            cross: "dead",
            random: 15,
          }}
          bg={true}
          style={{ zIndex: 1 }}
        />
      )}
      <Header />
      <Calc />
      <Cards />
    </div>
  );
};

export default Index;
