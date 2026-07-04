import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import customersRoutes from "./routes/customers.routes";
import paymentsRoutes from "./routes/payments.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/payments", paymentsRoutes);

app.use(errorHandler);

export default app;
