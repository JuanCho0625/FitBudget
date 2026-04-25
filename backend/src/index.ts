import Express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routes from "./routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./sockets"

dotenv.config();

const app = Express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

//Configurar socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*" // Cambiar despues por la url del frontend
  }
})

setupSocketHandlers(io);

app.set('io', io);

app.use(Express.json());

// Todas las rutas bajo /api
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "FitBudget API funcionando " });
});

const startApp = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor");
  }
};

startApp();
