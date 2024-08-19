import { useEffect, useState } from "react";

const Modal = ({ closeModal, date }) => {
  const [clientDate, setClientDate] = useState(null);

  useEffect(() => {
    setClientDate(date);
  }, [date]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-center text-xl mb-4 text-black">
          Lance suas horas
        </h2>
        <p className="text-center mb-4 text-black">
          {clientDate ? clientDate.toDateString() : ""}
        </p>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="time"
                defaultValue=""
                className="flex-1 p-2 border border-gray-300 rounded text-black"
              />
              <input
                type="time"
                defaultValue=""
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
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
