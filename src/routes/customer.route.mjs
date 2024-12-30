import { Router } from 'express'
import * as controller from '../controllers/customer.controller.mjs'

const router = Router()

/* Todos los clientes */
router.get("/all", controller.getAllCustomers)

/* Nuevo cliente */
router.get("/new", controller.getNewCustomer)
router.post("/new", controller.postNewCustomer)

/* Ver cliente */
router.get("/:id", controller.getCustomer)

/* Editar cliente */
router.get("/:id/edit", controller.getEditCustomer)
router.put("/:id/edit", controller.putEditCustomer)

/* Cambiar estado del cliente */
router.post("/:id/status", controller.postCustomerStatus)

export default router