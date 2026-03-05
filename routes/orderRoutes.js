import express from "express";
import { sendOrderEmail } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", sendOrderEmail);

export default router;
