import * as f_status from "../utils/formarters/status.formarter.mjs"
const uid_tec = process.env.UUID_TEC1


export const filterStatus = (req, res, next) => {
    const uid = uid_tec // -----------------------> !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const oid = req.params.oid

    const next_status = f_status.postNextStatus(oid, uid, req.body.next_status)

    if (next_status.next_status == 220 || next_status.next_status == 470) {
        return res.send({
            status: true,
            msg: "Indique el motivo por el cual no se puede efectuar la reparación!",
            url: `/order/${oid}/comment?sid=${next_status.next_status}`
        })
    }

    if (next_status.next_status == 300) {
        return res.send({
            status: true,
            msg: "Ingrese el presupuesto y su detalle!",
            url: `/order/${oid}/budget`
        })
    }

    if (next_status.next_status == 460) {
        return res.send({
            status: true,
            msg: "Detalle el motivo de la repación parcial!",
            url: `/order/${oid}/comment?sid=${next_status.next_status}`
        })
    }

    return next();
}