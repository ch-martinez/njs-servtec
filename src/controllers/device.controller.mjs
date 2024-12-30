import { getAllModelsByBrandDB } from "../models/device.model.mjs"

export const getAllModelsByBrand = async (req, res) => {
    const resp = await getAllModelsByBrandDB(req.params.id)
    res.json(resp)
}