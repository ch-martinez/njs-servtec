import { customer } from "./customer.formarter.mjs"

export const orders = (orderList) => {

    const orderF = (order) => {
        return {
            id: order.order_id,
            ticket: order.order_ticket,
            created_at: order.created_at,
            failure: order.order_failure,
            customer: {
                id: order.customer_id,
                name: `${order.customer_name} ${order.customer_lastname}`
            },
            status: 'Recepcion: Pendiente de envío a taller'
        }
    }

    let temp = []

    if (orderList) {
        orderList.forEach(order => {
            temp.push(orderF(order))
        })
    }

    return temp
}

export const orderNewPost = (customer_id, order) => {

    const prepaid = order.order_prepaid == 'on'
    const warranty = order.order_warranty == 'on'

    return ({
        customer_id: customer_id,
        order_ticket: order.order_ticket,
        order_warranty: warranty,
        order_warranty_id: warranty ? order.order_warranty_id : null,
        db_id: order.devices_brands,
        dm_id: order.devices_models,
        dm_other: order.devices_other,
        order_imei: order.order_imei,
        order_pin: order.order_pin,
        order_failure: order.order_failure,
        order_comment_atc: order.order_comment_atc,
        order_budget: order.order_budget,
        order_comment_budget: order.order_comment_budget,
        order_prepaid: prepaid,
        order_payment_method: prepaid ? order.order_payment_method : null
    })
}

export const order = (order) => {
    return {
        customer_id: order.customer_id ,
        id: order.order_id ,
        ticket: order.order_ticket ,
        warranty: order.order_warranty ,
        warranty_id: order.order_warranty_id ,
        imei: order.order_imei ,
        pin: order.order_pin ,
        failure: order.order_failure ,
        comment:{
            atc: order.order_comment_atc ,
            tec: order.order_comment_tec ,
            extra: order.order_comment_extra
        },
        device: {
            brand: order.db_name ,
            model: order.dm_model ,
            other: order.dm_other
        },
        budget: {
            budget: order.order_budget ,
            comment_budget: order.order_comment_budget ,
            prepaid: order.order_prepaid ,
            payment_method: order.order_payment_method
        },
        auth:{
            auth: order.order_auth ,
            auth_name: order.order_auth_name ,
            auth_dni: order.order_auth_dni
        },
        created_at: order.created_at ,
    }
}