import { Router } from 'express'
import * as controller from '../controllers/customer.controller.mjs'

const router = Router()

router.get("/all", controller.customersView)
router.get("/new", controller.customerNewView)
router.post("/new", controller.customerNew)
router.get("/:id", controller.customerDetailView)

router.get("/:id/edit", controller.customerEditView)
router.put("/:id/edit", controller.customerEditPut)

router.post("/:id/status", controller.statusCustomer)

export default router