import { Router } from "express";
import * as controller from "../controllers/order.controller.mjs";

const router = Router()

/* Todas las ordenes */
router.get('/all', controller.getAllOrders)

/* Nueva orden */
router.get('/new/customer/:cid', controller.getNewOrder)
router.post('/new/customer/:cid', controller.postNewOrder)

/* Nueva orden de garantia */
router.get('/new/warranty/:oid', controller.getNewWarranty)
router.post('/new/warranty/:oid', controller.postNewWarranty)

/* Ver orden */
router.get('/:id', controller.getOrder)

/* Editar Orden */
router.get('/:oid/edit', controller.getEditOrder)
router.post('/:oid/edit', controller.putEditOrder)

/* Siguiente estado de la orden */
router.post('/:oid/status', controller.postNextStatus)

/* Autorizacion de retiro */
router.get('/:oid/auth', controller.getAuthOrder)
router.post('/:oid/auth', controller.postAuthOrder)

/* Eliminar orden */
router.delete('/:oid', controller.deleteOrder)

export default router