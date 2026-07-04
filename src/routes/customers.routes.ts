import { Router } from "express";
import * as customersController from "../controllers/customers.controller";
import * as paymentsController from "../controllers/payments.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/", authenticate, authorize(["collector", "admin"]), customersController.list);
router.get("/:accountNumber", authenticate, customersController.getOne);
router.get("/:accountNumber/payments", authenticate, paymentsController.listByCustomer);

export default router;
