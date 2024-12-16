import { Router } from "express";
import {
    orderNewView,
    ordersView,
    orderDetailView,
    orderNew,
    orderWarrantyNewView,
    orderWarrantyNew,
    orderEditView,
    orderEdit,
    nextStatus
} from "../controllers/order.controller.mjs";

const router = Router()

router.get('/all', ordersView)

router.get('/new/customer/:cid', orderNewView)
router.post('/new/customer/:cid', orderNew)

router.get('/new/warranty/:oid', orderWarrantyNewView)
router.post('/new/warranty/:oid', orderWarrantyNew)


router.get('/:id', orderDetailView)

router.get('/:oid/edit', orderEditView)
router.post('/:oid/edit', orderEdit)

router.post('/:id/status', nextStatus)

export default router