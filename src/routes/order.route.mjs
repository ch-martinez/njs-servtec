import { Router } from "express";
import { orderNewView, ordersView, orderDetailView, orderNew } from "../controllers/order.controller.mjs";

const router = Router()

router.get('/all', ordersView)

router.get('/new/customer/:cid', orderNewView)
router.post('/new/customer/:cid', orderNew)

router.get('/:id', orderDetailView)

export default router