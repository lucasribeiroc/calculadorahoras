const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://admin:V%40isefoder12@calculadorahoras.h0yrt.mongodb.net/calculadorahoras?retryWrites=true&w=majority&appName=calculadorahoras";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas", err);
  }
}

run().catch(console.dir);

const timeEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  times: [
    {
      entrada: { type: String },
      saida: { type: String },
    },
  ],
  totalHours: { type: Number, required: true },
  monthlyTotalHours: { type: Number, default: 0 },
  monthlyTotalToReceive: { type: Number, default: 0 }, // Novo campo para total a receber no mês
});

const TimeEntry = mongoose.model("TimeEntry", timeEntrySchema, "timeentries");

// Endpoint para carregar todos os registros
app.get("/load", async (req, res) => {
  try {
    const data = await TimeEntry.find({});
    res.status(200).send(data);
  } catch (error) {
    console.error("Erro ao carregar os dados do MongoDB", error);
    res
      .status(500)
      .send({ message: "Erro ao carregar os dados", error: error.message });
  }
});

// Endpoint para salvar horários
app.post("/api/save-times", async (req, res) => {
  const { date, times, totalHours } = req.body;
  const valorHora = 25.0; // Defina o valor da hora aqui
  console.log("Dados recebidos:", { date, times, totalHours });

  try {
    const existingEntry = await TimeEntry.findOne({ date });
    if (existingEntry) {
      existingEntry.times = times;
      existingEntry.totalHours = totalHours;
      await existingEntry.save();
    } else {
      const newEntry = new TimeEntry({ date, times, totalHours });
      await newEntry.save();
    }

    // Atualizar as horas totais do mês e o total a receber
    await updateMonthlyTotalHoursAndToReceive(date, valorHora);

    res
      .status(200)
      .send({ message: "Horários salvos com sucesso", totalHours });
  } catch (error) {
    console.error("Erro ao salvar os horários no MongoDB", error);
    res
      .status(500)
      .send({ message: "Erro ao salvar os horários", error: error.message });
  }
});

// Função para atualizar as horas totais do mês e o total a receber
const updateMonthlyTotalHoursAndToReceive = async (date, valorHora) => {
  const [year, month] = date.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const data = await TimeEntry.aggregate([
    {
      $match: {
        date: {
          $gte: startDate.toISOString().split("T")[0],
          $lte: endDate.toISOString().split("T")[0],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalHours: { $sum: "$totalHours" },
      },
    },
  ]);

  const totalHours = data.length > 0 ? data[0].totalHours : 0;
  const totalToReceive = totalHours * valorHora;

  await TimeEntry.updateMany(
    {
      date: {
        $gte: startDate.toISOString().split("T")[0],
        $lte: endDate.toISOString().split("T")[0],
      },
    },
    {
      $set: {
        monthlyTotalHours: totalHours,
        monthlyTotalToReceive: totalToReceive,
      },
    }
  );
};

// Endpoint para buscar horários por data
app.get("/api/get-times", async (req, res) => {
  const { date } = req.query;
  try {
    const data = (await TimeEntry.findOne({ date })) || {
      times: Array.from({ length: 5 }, () => ({ entrada: "", saida: "" })),
      totalHours: 0,
    };
    res.status(200).send(data);
  } catch (error) {
    console.error("Erro ao buscar os horários no MongoDB", error);
    res
      .status(500)
      .send({ message: "Erro ao buscar os horários", error: error.message });
  }
});

// Endpoint para atualizar horários
app.put("/api/update-times", async (req, res) => {
  const { date, times, totalHours } = req.body;
  const valorHora = 25.0; // Defina o valor da hora aqui
  try {
    const existingEntry = await TimeEntry.findOne({ date });
    if (existingEntry) {
      existingEntry.times = times;
      existingEntry.totalHours = totalHours;
      await existingEntry.save();

      // Atualizar as horas totais do mês e o total a receber
      await updateMonthlyTotalHoursAndToReceive(date, valorHora);

      res.status(200).send({ message: "Horários atualizados com sucesso" });
    } else {
      res.status(404).send({ message: "Entrada não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao atualizar os horários no MongoDB", error);
    res
      .status(500)
      .send({ message: "Erro ao atualizar os horários", error: error.message });
  }
});

// Endpoint para deletar horários
app.delete("/api/delete-times", async (req, res) => {
  const { date } = req.body;
  const valorHora = 25.0; // Defina o valor da hora aqui
  try {
    const result = await TimeEntry.deleteOne({ date });
    if (result.deletedCount > 0) {
      // Atualizar as horas totais do mês e o total a receber
      await updateMonthlyTotalHoursAndToReceive(date, valorHora);

      res.status(200).send({ message: "Horários deletados com sucesso" });
    } else {
      res.status(404).send({ message: "Entrada não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao deletar os horários no MongoDB", error);
    res
      .status(500)
      .send({ message: "Erro ao deletar os horários", error: error.message });
  }
});

// Endpoint para buscar as horas totais do mês e o total a receber
app.get("/api/monthly-total-hours", async (req, res) => {
  const { month, year } = req.query;
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const data = await TimeEntry.aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toISOString().split("T")[0],
            $lte: endDate.toISOString().split("T")[0],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: "$totalHours" },
        },
      },
    ]);

    const totalHours = data.length > 0 ? data[0].totalHours : 0;
    const valorHora = 25.0; // Defina o valor da hora aqui
    const totalToReceive = totalHours * valorHora;

    res.status(200).send({ totalHours, totalToReceive });
  } catch (error) {
    console.error("Erro ao calcular as horas totais do mês", error);
    res.status(500).send({
      message: "Erro ao calcular as horas totais do mês",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
