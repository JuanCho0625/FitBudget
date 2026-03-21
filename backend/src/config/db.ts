import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("No se pudo conectar a MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
