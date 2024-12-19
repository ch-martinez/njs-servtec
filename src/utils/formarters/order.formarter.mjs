import { noData } from "./general.formarter.mjs"
import { fullDateStr } from "./date.formarter.mjs"

export const orders = (orders) => {
    let arr = []

    if (orders) {
        orders.forEach(o => {
            arr.push({
                id: o.order_id,
                ticket: o.order_ticket,
                failure: o.order_failure,
                created_at: fullDateStr(o.created_at),
                customer: {
                    id: o.customer_id,
                    name: o.customer_name,
                    lastname: o.customer_lastname
                },
                status: o.osc_description
            })
        })
    }

    return arr
}

export const postNewOrder = (customer_id, order) => {

    const prepaid = order.order_prepaid == 'on'

    return ({
        customer_id: customer_id,
        db_id: order.devices_brands,
        dm_id: order.devices_models,
        dm_other: noData(order.devices_other),
        order_imei: order.order_imei,
        order_pin: order.order_pin,
        order_failure: noData(order.order_failure),
        order_comment_atc: noData(order.order_comment_atc),
        order_budget: order.order_budget,
        order_budget_detail: noData(order.order_budget_detail),
        order_prepaid: prepaid,
        pm_id: prepaid ? order.payment_method : null
    })
}

export const postNewWarranty = (main_id, order) => {
    return ({
        main_id: main_id,
        order_pin: order.order_pin,
        order_failure: noData(order.order_failure),
        order_comment_atc: noData(order.order_comment_atc),
    })
}

export const order = (order) => {
    return {
        customer_id: order.customer_id,
        id: order.order_id,
        ticket: order.order_ticket,
        imei: order.order_imei,
        pin: order.order_pin,
        failure: order.order_failure,
        comment:{
            atc: order.order_comment_atc,
            tec: order.order_comment_tec,
            extra: order.order_comment_extra
        },
        device: {
            brand_id: order.db_id,
            brand: order.db_name,
            model_id: order.dm_id,
            model: order.dm_model,
            other: order.dm_other
        },
        budget: {
            budget: order.order_budget,
            detail: order.order_budget_detail,
            prepaid: order.order_prepaid == 0 ? "NO" : "SI",
            payment_method: noData(order.pm_name),
            payment_method_id: order.pm_id
        },
        auth:{
            auth: order.order_auth,
            auth_name: order.order_auth_name,
            auth_dni: order.order_auth_dni
        },
        created_at: fullDateStr(order.created_at),
    }
}

export const putEditOrder = (oid, order) => {

    const prepaid = order.order_prepaid == 'on'

    return ({
        order_id: Number(oid),
        db_id: Number(order.devices_brands),
        dm_id: Number(order.devices_models),
        dm_other: noData(order.devices_other),
        order_imei: Number(order.order_imei),
        order_pin: order.order_pin,
        order_failure: noData(order.order_failure),
        order_comment_atc: noData(order.order_comment_atc),
        order_comment_tec: noData(order.order_comment_tec),
        order_comment_extra: noData(order.order_comment_extra),
        order_budget: Number(order.order_budget),
        order_budget_detail: noData(order.order_budget_detail),
        order_prepaid: prepaid,
        pm_id: prepaid ? order.payment_method : null
    })
}

export const list = (orders) => {

    let arr = []

    orders.forEach((order) => {
        arr.push({
            id: order.order_id,
            ticket: order.order_ticket,
            failure: order.order_failure,
            status: 'FORMARTER: order.order_status',
            created_at: fullDateStr(order.created_at)
        })
    })

    return (arr)
}