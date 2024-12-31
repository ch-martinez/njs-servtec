import * as m_db from "../models/device.model.mjs"
import * as m_order from "../models/order.model.mjs"
import * as m_customer from "../models/customer.model.mjs"
import * as m_pm from "../models/payment_method.model.mjs"
import * as m_status from "../models/status.model.mjs"
import * as f_order from "../utils/formarters/order.formarter.mjs"
import * as f_customer from "../utils/formarters/customer.formarter.mjs"
import * as f_pm from "../utils/formarters/payment_method.formarter.mjs"
import * as f_status from "../utils/formarters/status.formarter.mjs"
import * as generate from "../utils/generate.mjs"

const uid_tec = process.env.UUID_TEC1
const uid_atc = process.env.UUID_ATC2

export const getAllOrders = async (req, res) => {
    const orders = f_order.orders(await m_order.getAllOrdersDB())

    const data = {
        title: 'Ordenes',
        nav: 'order'
    }

    res.render('pages/order/orders', { layout: 'layouts/main_layout', data, orders });
}

export const getNewOrder = async (req, res) => {

    const cid = req.params.cid

    const customer = f_customer.customer(await m_customer.getCustomerDB(cid))
    const devices_brands = await m_db.getAllBrandsDB()
    const pm = f_pm.paymentMethods((await m_pm.getAllPaymentsMethodsDB()).data)

    const data = {
        title: 'Nueva orden',
        nav: 'order'
    }

    res.render('pages/order/order_new', { layout: 'layouts/main_layout', data, devices_brands, customer, pm });
}

export const postNewOrder = async (req, res) => {

    const oid = await generate.uuid()
    let order_data = f_order.postNewOrder(req.params.cid, oid, req.body)
    const ticket = await generate.ticket("ORD")

    order_data = {
        ...order_data,
        order_ticket: ticket,
        /* *************************** USUARIO PRUEBA ********************************** */
        uid: uid_atc
    }

    const insertRes = await m_order.insertOrderDB(order_data)

    if (insertRes.status) {
        res.send({
            status: true,
            msg: "Orden creada con exito!",
            url: `/order/${oid}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error al crear la orden!"
        })
    }
}

export const getNewWarranty = async (req, res) => {

    const oid = req.params.oid
    const warranty = await m_order.hasWarrantyDB(oid)
    const order = f_order.order(await m_order.getOrderDB(oid));

    if (warranty.status) return res.redirect(`/order/${warranty.warranty_id}`)

    if (!order.finished) return res.redirect(`/order/${oid}`)

    const customer = f_customer.customer(await m_customer.getCustomerDB(order.customer_id));

    const data = {
        title: `Nueva garantia`,
        nav: 'order'
    };

    res.render('pages/order/order_new_warranty', { layout: 'layouts/main_layout', data, order, customer, warranty });

}

export const postNewWarranty = async (req, res) => {
    const warranty_id = await generate.uuid()
    const main_id = req.params.oid
    const uid = uid_atc
    let order_data = f_order.postNewWarranty(main_id, warranty_id, uid, req.body)
    const ticket = await generate.ticket("GTA")

    order_data = {
        ...order_data,
        order_ticket: ticket
    }

    const insertRes = await m_order.insertWarrantyDB(order_data)

    if (insertRes.status) {
        res.send({
            status: true,
            msg: "Orden creada con exito!",
            url: `/order/${warranty_id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error al crear la orden!"
        })
    }
}

export const getOrder = async (req, res) => {

    const oid = req.params.id
    const order = f_order.order(await m_order.getOrderDB(oid))
    const customer = f_customer.customer(await m_customer.getCustomerDB(order.customer_id))
    const statusHistory = f_status.statusHistory(await m_status.getStatusHistoryDB(oid))
    const warranty = await m_order.isWarrantyDB(oid)
    const lastStatus = f_status.lastStatus(await m_status.getLastStatusDB(oid))

    const data = {
        title: `Orden #${order.ticket}`,
        nav: 'order'
    }

    res.render('pages/order/order_detail', { layout: 'layouts/main_layout', data, order, customer, statusHistory, lastStatus, warranty });
}

export const getEditOrder = async (req, res) => {
    const oid = req.params.oid

    const order = f_order.order(await m_order.getOrderDB(oid))
    const customer = f_customer.customer(await m_customer.getCustomerDB(order.customer_id))
    const devices_brands = await m_db.getAllBrandsDB()
    const pm = f_pm.paymentMethods((await m_pm.getAllPaymentsMethodsDB()).data)

    const data = {
        title: `Orden #${order.ticket}`,
        nav: 'order'
    }
    res.render('pages/order/order_edit', { layout: 'layouts/main_layout', data, order, customer, devices_brands, pm });
}

export const putEditOrder = async (req, res) => {
    const order = f_order.putEditOrder(req.params.oid, req.body)
    const updateRes = await m_order.updateOrderInDB(order)

    if (updateRes.status) {
        res.send({
            status: true,
            msg: "Actualizado con exito!",
            url: `/order/${order.order_id}`
        })
    } else {
        res.send({
            status: false,
            msg: "Error al actualizar los datos!"
        })
    }
}

export const postNextStatus = async (req, res) => {
    const uid = uid_tec // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const next_status = f_status.postNextStatus(req.params.oid, uid, req.body.next_status)
    const insertResp = await m_status.insertNextStatusDB(next_status)

    if (insertResp.status) {
        res.send({
            status: true,
            msg: "Se actualizo el estado!",
            url: `/order/${next_status.order_id}`
        })
    } else {
        res.send({
            status: false,
            msg: "Error al actualizar el estado!"
        })
    }
}

export const getAuthOrder = async (req, res) => {
    const oid = req.params.oid
    const auth = f_order.authOrder(await m_order.getAuthOrderDB(oid))

    const data = {
        title: `Autorizar retiro`,
        nav: 'order'
    }

    res.render('pages/order/order_auth', { layout: 'layouts/main_layout', data, oid, auth });
}

export const postAuthOrder = async (req, res) => {
    const oid = req.params.oid
    const uid = uid_atc // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const updateRes = await m_order.updateAuthOrderDB(f_order.postAuthOrder(uid, oid, req.body))

    if (updateRes.status) {
        res.send({
            status: true,
            msg: "Se cargó autorización!",
            url: `/order/${oid}`
        })
    } else {
        res.send({
            status: false,
            msg: "Error al cargar la autorización!"
        })
    }
}

export const deleteOrder = async (req, res) => {
    const deletResp = await m_order.deleteOrderDB(req.params.oid)

    if (deletResp.status) {
        res.send({
            status: true,
            msg: "Orden eliminada con exito!",
            url: `/order/all`
        })
    } else {
        const msg = deletResp.error == 1451 ? "No se puede eliminar una orden con garantias asociadas!" : "Error al eliminar la orden!"
        res.send({
            status: false,
            msg: msg
        })
    }
}