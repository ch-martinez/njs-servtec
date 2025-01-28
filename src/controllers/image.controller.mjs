import { getTicketByIdFromDB } from "../models/order.model.mjs"
import { saveImage } from "../utils/files_upload.mjs"

const uid_tec = process.env.UUID_TEC1
const uid_atc = process.env.UUID_ATC2

export const getImageUpload = async (req, res) => {
    const oid = req.params.oid

    const data = {
        title: 'Fotos Evidencia',
        nav: 'order'
    }

    res.render('pages/order/sections/order_image_upload', { layout: 'layouts/main_layout', data, oid});
}

export const postImageUpload = async (req, res) => {
    const files = req.files
    const oid = req.params.oid

    const otk = await getTicketByIdFromDB(oid)

    try {
        if (!files || files.length === 0) {
            return res.status(400)
            .send({
                status: false,
                msg: "No se han cargado imagenes!",
                url: `/order/${req.params.oid}`
            })
        }

        files.map((img, i) => {saveImage(otk,img,i)})

        res.status(200)
        .send({
            status: true,
            msg: "Imagenes cargadas!",
            url: `/order/${req.params.oid}`
        })
    } catch (error) {
        res.status(500)
        .send({
            status: false,
            msg: "Error al cargar imagenes!",
            url: `/order/${req.params.oid}`
        })
    }
}