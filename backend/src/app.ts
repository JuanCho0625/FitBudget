import Express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./sockets";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
dotenv.config();

const app = Express();
const httpServer = createServer(app);


app.use(cors());

// Configurar socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*"  // Cambiar después por la url del frontend
  }
});

setupSocketHandlers(io);
app.set('io', io);

// Middlewares
app.use(Express.json());
 
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FitBudget API",
      version: "1.0.0",
      description: "Documentación de la API de FitBudget",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],  
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "FitBudget API funcionando" });
});

export { app, httpServer };