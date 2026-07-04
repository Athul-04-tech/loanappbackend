import { Router } from "express";
import * as paymentsController from "../controllers/payments.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { paymentSchema, validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["customer", "admin"]),
  validateRequest(paymentSchema),
  paymentsController.create
);

export default router;
