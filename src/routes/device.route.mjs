import { Router } from "express";
import { getAllModelsByBrand } from "../controllers/device.controller.mjs";
const router = Router()

router.get("/api/get_models/:id", getAllModelsByBrand)

export default router