import { httpServer } from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 3000;

const startApp = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Servidor de FitBudget corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor", error);
  }
};

startApp();