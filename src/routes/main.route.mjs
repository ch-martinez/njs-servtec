import { Router } from 'express'
import * as controller from '../controllers/main.controller.mjs'

const router = Router()

router.get("/", controller.getMain)

export default router