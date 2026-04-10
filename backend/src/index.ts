import Express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import routes from "./routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";


dotenv.config();

const app = Express();
const PORT = process.env.PORT || 3000;

app.use(Express.json());
app.use("/api", routes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Api works");
});

const startApp = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Couldn't start server");
    }
};

startApp();