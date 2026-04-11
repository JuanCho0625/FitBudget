import Express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routes from "./routes";

dotenv.config();

const app = Express();
const PORT = process.env.PORT || 3000;

app.use(Express.json());

// Todas las rutas bajo /api
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "FitBudget API funcionando ✅" });
});

const startApp = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor");
  }
};

startApp();
