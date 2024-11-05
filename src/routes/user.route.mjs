import { Router } from 'express'
import * as controller from '../controllers/user.controller.mjs'

const router = Router()

router.get("/all", controller.userAllView)
router.get("/new", controller.userNewView)
router.get("/:id", controller.userView)

export default router