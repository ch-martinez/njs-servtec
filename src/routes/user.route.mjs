import { Router } from 'express'
import * as controller from '../controllers/user.controller.mjs'

const router = Router()

router.get("/all", controller.userAllView)

// Nuevo usuario
router.get("/new", controller.userNewView)
router.post("/new", controller.userNew)

router.get("/:id", controller.userView)

router.get("/:id/edit", controller.userEditView)
router.put("/:id/edit", controller.userEditPut)

router.post("/:id/status", controller.statusUser)

router.get("/:id/pwd/update", controller.updateUserPasswordView)

router.put("/:id/pwd/update", controller.updateUserPassword)

router.post("/:id/pwd/reset", controller.resetUserPassword)

export default router