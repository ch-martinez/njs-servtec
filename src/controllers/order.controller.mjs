import * as db_model from "../models/device.model.mjs"
import * as order_model from "../models/order.model.mjs"
import * as cust_model from "../models/customer.model.mjs"
import * as pm_model from "../models/payment_method.model.mjs"
import * as status_model from "../models/status.model.mjs"
import * as order_formarter from "../utils/formarters/order.formarter.mjs"
import * as cust_formarter from "../utils/formarters/customer.formarter.mjs"
import * as pm_formarter from "../utils/formarters/payment_method.formarter.mjs"
import { ticketGenerator } from "../utils/ticket_generator.mjs"
import * as status_formarter from "../utils/formarters/status.formarter.mjs"

export const ordersView = async (req, res) => {
    const orders = order_formarter.orders(await order_model.getAllOrdersFromDB())

    const data = {
        title: 'Ordenes',
        nav: 'order'
    }

    res.render('pages/order/orders', { layout: 'layouts/main_layout', data, orders });
}

export const orderNewView = async (req, res) => {

    const cid = req.params.cid

    const customer = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(cid))
    const devices_brands = await db_model.getAllDevicesBrandsFromDB()
    const pm = pm_formarter.pmList((await pm_model.getAllPMfromDB()).data)

    const data = {
        title: 'Nueva orden',
        nav: 'order'
    }

    res.render('pages/order/order_new', { layout: 'layouts/main_layout', data, devices_brands, customer, pm });
}

export const orderWarrantyNewView = async (req, res) => {

    const oid = req.params.oid
    const warranty = await order_model.orderHasWarrantyInDB(oid)

    if (warranty.status) {
        res.redirect(`/order/${warranty.order_id}`)
    } else {

        const order = order_formarter.order(await order_model.getOrderByFromDB(oid))
        const customer = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(order.customer_id))

        const data = {
            title: `Nueva garantia`,
            nav: 'order'
        }

        res.render('pages/order/order_new_warranty', { layout: 'layouts/main_layout', data, order, customer, warranty });
    }

}

export const orderNew = async (req, res) => {

    let order_data = order_formarter.orderNewPost(req.params.cid, req.body)
    const ticket = await ticketGenerator("ORD")

    order_data = {
        ...order_data,
        order_ticket: ticket,
        /* *************************** USUARIO PRUEBA ********************************** */
        uid: 1 
    }

    const insertRes = await order_model.insertOrderInDB(order_data)

    if (insertRes.status) {
        res.send({
            status: true,
            msg: "Orden creada con exito!",
            url: `/order/${insertRes.order_id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error al crear la orden!"
        })
    }
}

export const orderWarrantyNew = async (req, res) => {

    let order_data = order_formarter.orderWarrantyNewPost(req.params.oid, req.body)
    const ticket = await ticketGenerator("GTA")

    order_data = {
        ...order_data,
        order_ticket: ticket
    }

    const insertRes = await order_model.insertWarrantyInDB(order_data)

    if (insertRes.status) {
        res.send({
            status: true,
            msg: "Orden creada con exito!",
            url: `/order/${insertRes.order_id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error al crear la orden!"
        })
    }
}

export const orderDetailView = async (req, res) => {

    const oid = req.params.id
    const order = order_formarter.order(await order_model.getOrderByFromDB(oid))
    const customer = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(order.customer_id))
    const status = status_formarter.statusLog(await status_model.getStatusLogDB(oid))

    const status_next = status_formarter.lastStatus(await status_model.getLastStatus(oid))
console.log(status_next)

    const data = {
        title: `Orden #${order.ticket}`,
        nav: 'order'
    }

    res.render('pages/order/order_detail', { layout: 'layouts/main_layout', data, order, customer, status, status_next });
}

export const orderEditView = async (req, res) => {
    const oid = req.params.oid

    const order = order_formarter.order(await order_model.getOrderByFromDB(oid))
    const customer = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(order.customer_id))
    const devices_brands = await db_model.getAllDevicesBrandsFromDB()
    const pm = pm_formarter.pmList((await pm_model.getAllPMfromDB()).data)

    const data = {
        title: `Orden #${order.ticket}`,
        nav: 'order'
    }
    res.render('pages/order/order_edit', { layout: 'layouts/main_layout', data, order, customer, devices_brands, pm });
}

export const orderEdit = async (req, res) => {
    const order = order_formarter.orderUpdatePost(req.params.oid, req.body)
    const updateRes = await order_model.updateOrderInDB(order)

    if (updateRes.status) {
        res.send({
            status: true,
            msg: "Actualizado con exito!",
            url: `/order/${order.order_id}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al actualizar los datos!"
        })
    }
}

export const nextStatus = async (req, res) => {
    const data = status_formarter.nextStatus(req.params.id, 3, req.body.next_status)

    const resp = await status_model.nextStatus(data)
    if (resp.status) {
        res.send({
            status: true,
            msg: "Se actualizo el estado!",
            url: `/order/${data.oid}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al actualizar el estado!"
        })
    }
}