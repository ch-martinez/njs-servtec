import { Router } from "express";
import { orderNewView, ordersView } from "../controllers/order.controller.mjs";

const router = Router()

router.get('/all', ordersView)
router.get('/new', orderNewView)

export default router