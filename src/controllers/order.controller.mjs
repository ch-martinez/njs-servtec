import * as db_model from "../models/device.model.mjs"
import * as order_model from "../models/order.model.mjs"
import * as cust_model from "../models/customer.model.mjs"
import * as formarter from "../utils/formarters/order.formarter.mjs"
import * as cust_formarter from "../utils/formarters/customer.formarter.mjs"

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
    const cust = cust_formarter.customer(await cust_model.getCustomerByIdFromDB(1))

    const data = {
        title: 'Nueva orden',
        nav: 'order'
    }

    res.render('pages/order/order_new', { layout: 'layouts/main_layout', data, devices_brands, cust });
}