import Express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./sockets";

dotenv.config();

const app = Express();
const httpServer = createServer(app);

// Configurar socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*"  // Cambiar despues por la url del frontend
  }
});

setupSocketHandlers(io);
app.set('io', io);
app.use(Express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "FitBudget API funcionando" });
});

 
export { app, httpServer };