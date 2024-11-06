import { Router } from 'express'
import * as controller from '../controllers/customer.controller.mjs'

const router = Router()

router.get("/all", controller.customersView)
router.get("/new", controller.customerNewView)
router.get("/:id", controller.customerDetailView)

export default router