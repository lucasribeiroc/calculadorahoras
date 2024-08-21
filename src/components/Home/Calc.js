import Head from "next/head";
import Calendar from "../Calendar";

export default function Calc() {
  return (
    <div className="bg-lightgray h-auto">
      <Head>
        <title>Calculadora de Horas</title>
      </Head>
      <main className="p-4">
        <Calendar />
      </main>
    </div>
  );
}
