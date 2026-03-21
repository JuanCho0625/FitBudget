import Express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config(); 

const app = Express();
const PORT = process.env.PORT || 3000;

app.use(Express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
