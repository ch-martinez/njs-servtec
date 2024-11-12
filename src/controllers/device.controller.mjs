import { getAllDevicesBrandsFromDB, getAllModelsByBrandIdFromDB } from "../models/device.model.mjs"

export const getAllModelsByBrand = async (req, res) => {
    console.log(req.params.id)
    const models = await getAllModelsByBrandIdFromDB(req.params.id)
    res.json(models)
}