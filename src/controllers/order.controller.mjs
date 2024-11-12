import * as db_model from "../models/device.model.mjs"
import * as order_model from "../models/order.model.mjs"
import * as formarter from "../utils/formarters/order.formarter.mjs"

export const ordersView = async (req, res) => {
    const orders = formarter.orders(await order_model.getAllOrdersFromDB())

    const data = {
        title: 'Ordenes',
        nav: 'order'
    }

    res.render('pages/order/orders', { layout: 'layouts/main_layout', data, orders });
}

export const orderNewView = async (req, res) => {

    const devices_brands = await db_model.getAllDevicesBrandsFromDB()

    const data = {
        title: 'Nueva orden',
        nav: 'order'
    }

    res.render('pages/order/order_new', { layout: 'layouts/main_layout', data, devices_brands });
}