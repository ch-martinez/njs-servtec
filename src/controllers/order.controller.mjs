import * as db_model from "../models/device.model.mjs"
import * as order_model from "../models/order.model.mjs"
import * as cust_model from "../models/customer.model.mjs"
import * as order_formarter from "../utils/formarters/order.formarter.mjs"
import * as cust_formarter from "../utils/formarters/customer.formarter.mjs"

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

    const devices_brands = await db_model.getAllDevicesBrandsFromDB()
    const cust = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(cid))

    const data = {
        title: 'Nueva orden',
        nav: 'order'
    }

    res.render('pages/order/order_new', { layout: 'layouts/main_layout', data, devices_brands, cust });
}

export const orderNew = async (req, res) => {
    const order_data = order_formarter.orderNewPost(req.params.cid, req.body)

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

export const orderDetailView = async (req, res) => {

    const oid = req.params.id
    const order = order_formarter.order(await order_model.getOrderByFromDB(oid))
    const customer = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(order.customer_id))

    const data = {
        title: 'Orden #CFM-0000598',
        nav: 'order'
    }

    console.log(order, customer);

    res.render('pages/order/order_detail', { layout: 'layouts/main_layout', data, order, customer });
}