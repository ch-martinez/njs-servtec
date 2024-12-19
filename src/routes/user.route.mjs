import { Router } from 'express'
import * as controller from '../controllers/user.controller.mjs'

const router = Router()

/* Todos los usuarios */
router.get("/all", controller.getAllUsers)

// Nuevo usuario
router.get("/new", controller.getNewUser)
router.post("/new", controller.postNewUser)

/* Ver usuario */
router.get("/:id", controller.getUser)

/* Editar usuario */
router.get("/:id/edit", controller.getEditUser)
router.put("/:id/edit", controller.putEditUser)

/* Cambiar estado de usuario */
router.post("/:id/status", controller.postUserStatus)

/* Actualizar contraseña */
router.get("/:id/pwd/update", controller.getUpdatePassword)
router.put("/:id/pwd/update", controller.putUpdatePassword)

/* Restablecer contraseña */
router.post("/:id/pwd/reset", controller.postResetPassword)

export default router