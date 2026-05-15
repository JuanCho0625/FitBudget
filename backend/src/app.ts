import "dotenv/config";
import Express from "express";
import routes from "./routes";

import { createServer } from "http";

import { Server } from "socket.io";

import { setupSocketHandlers } from "./sockets";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import cors from "cors";

const app = Express();

const httpServer = createServer(app);

// Middlewares
app.use(
    cors({
      origin:  "https://fit-budget-coral.vercel.app",
    })
);

app.use(Express.json());

// Configurar socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "https://fit-budget-coral.vercel.app",
  },
});

setupSocketHandlers(io);

app.set("io", io);

// Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "FitBudget API",
      version: "1.0.0",
      description: "Documentación de la API de FitBudget",
    },

    servers: [
      {
        url: "https://fitbudget.onrender.com",
      },
    ],
  },

  apis: [
    "./src/routes/*.ts",
    "./src/models/*.ts",
  ],
};

const swaggerDocs =
    swaggerJsdoc(swaggerOptions);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
);

// Rutas
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    message: "FitBudget API funcionando",
  });
});

export { app, httpServer };