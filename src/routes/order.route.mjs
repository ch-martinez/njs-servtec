import { Router } from "express";
import { orderNewView, ordersView, orderDetailView } from "../controllers/order.controller.mjs";

const router = Router()

router.get('/all', ordersView)
router.get('/new', orderNewView)
router.get('/detail', orderDetailView)

export default router