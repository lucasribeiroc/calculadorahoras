import { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import Modal from "../components/Modal";
import "react-calendar/dist/Calendar.css";

const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Garantir que a data atual seja definida apenas no cliente
    setCurrentDate(new Date());
  }, []);

  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    openModal(date);
  };

  return (
    <div className="p-4">
      <ReactCalendar
        onClickDay={handleDateClick}
        className="custom-calendar border border-gray-300 rounded-lg shadow-lg p-4"
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const isToday = date.toDateString() === currentDate.toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isWeekday = !isWeekend;
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            return [
              "p-2 text-center rounded-lg cursor-pointer",
              isToday ? "bg-yellow-300 text-black" : "",
              isWeekend ? "text-red-500" : "",
              isWeekday ? "text-gray-500" : "",
              !isCurrentMonth ? "tile-disabled" : "",
              "hover:bg-gray-200",
            ].join(" ");
          }
        }}
        navigationLabel={({ date, label, locale, view }) => (
          <div className="text-blue-500 font-semibold">{label}</div>
        )}
        nextLabel={<span className="text-blue-500">&gt;</span>}
        prevLabel={<span className="text-blue-500">&lt;</span>}
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: "short" })
        }
      />
      {isModalOpen && <Modal closeModal={closeModal} date={selectedDate} />}
    </div>
  );
};

export default Calendar;
