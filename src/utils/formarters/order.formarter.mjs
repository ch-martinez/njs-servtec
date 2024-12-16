import { customer } from "./customer.formarter.mjs"
import { sd } from "./general.formarter.mjs"
import { dateFull } from "./date.formarter.mjs"

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

    return ({
        customer_id: customer_id,
        db_id: order.devices_brands,
        dm_id: order.devices_models,
        dm_other: sd(order.devices_other),
        order_imei: order.order_imei,
        order_pin: order.order_pin,
        order_failure: sd(order.order_failure),
        order_comment_atc: sd(order.order_comment_atc),
        order_budget: order.order_budget,
        order_comment_budget: sd(order.order_comment_budget),
        order_prepaid: prepaid,
        pm_id: prepaid ? order.payment_method : null
    })
}

export const orderWarrantyNewPost = (wid, order) => {
    return ({
        order_warranty_id: wid,
        order_pin: order.order_pin,
        order_failure: sd(order.order_failure),
        order_comment_atc: sd(order.order_comment_atc),
    })
}

export const order = (order) => {
    return {
        customer_id: order.customer_id ,
        id: order.order_id ,
        ticket: order.order_ticket ,
        warranty: order.order_warranty ,
        warranty_id: order.order_warranty_id ,
        warranty_ticket: order.warranty_ticket ,
        imei: order.order_imei ,
        pin: order.order_pin ,
        failure: order.order_failure ,
        comment:{
            atc: order.order_comment_atc ,
            tec: order.order_comment_tec ,
            extra: order.order_comment_extra
        },
        device: {
            brand_id: order.db_id ,
            brand: order.db_name ,
            model_id: order.dm_id ,
            model: order.dm_model ,
            other: order.dm_other
        },
        budget: {
            budget: order.order_budget ,
            comment: order.order_comment_budget ,
            prepaid: order.order_prepaid == 0 ? false : true ,
            payment_method: sd(order.pm_name),
            payment_method_id: order.pm_id
        },
        auth:{
            auth: order.order_auth ,
            auth_name: order.order_auth_name ,
            auth_dni: order.order_auth_dni
        },
        created_at: order.created_at ,
    }
}

export const orderUpdatePost = (oid, order) => {

    const prepaid = order.order_prepaid == 'on'

    return ({
        order_id: Number(oid),
        db_id: Number(order.devices_brands),
        dm_id: Number(order.devices_models),
        dm_other: sd(order.devices_other),
        order_imei: Number(order.order_imei),
        order_pin: order.order_pin,
        order_failure: sd(order.order_failure),
        order_comment_atc: sd(order.order_comment_atc),
        order_comment_tec: sd(order.order_comment_tec),
        order_comment_extra: sd(order.order_comment_extra),
        order_budget: Number(order.order_budget),
        order_comment_budget: sd(order.order_comment_budget),
        order_prepaid: prepaid,
        pm_id: prepaid ? order.payment_method : null
    })
}

export const list = (orderList) => {

    let arr = []

    orderList.forEach((order) => {
        arr.push({
            id: order.order_id,
            ticket: order.order_ticket,
            failure: order.order_failure,
            status: 'FORMARTER: order.order_status',
            created_at: dateFull(order.created_at)
        })
    })

    return (arr)
}