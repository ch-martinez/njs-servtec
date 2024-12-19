import { fullDateStr } from "./date.formarter.mjs"
import { noData } from "./general.formarter.mjs"

export const customer = (cust) => {
    return {
        id: cust.customer_id,
        name: cust.customer_name,
        lastname: cust.customer_lastname,
        email: cust.customer_email,
        dni: cust.customer_dni,
        tel: cust.customer_tel,
        tel_alt: cust.customer_tel_alt,
        obs: cust.customer_obs,
        created_at: fullDateStr(cust.created_at),
        updated_at: fullDateStr(cust.updated_at),
        status: cust.customer_status == 1,
        status_at: fullDateStr(cust.status_at),
        deleted: cust.deleted == 0 ? false : true,
        deleted_user_id: cust.deleted_user_id,
        deleted_at: fullDateStr(cust.deleted_at)
    }
}

export const postNewCustomer = (cust) => {
    return {
        //customer_id: cust.customer_id,
        customer_name: noData(cust.customer_name),
        customer_lastname: noData(cust.customer_lastname),
        customer_email: noData((cust.customer_email).toLowerCase()),
        customer_dni: Number(cust.customer_dni),
        customer_tel: Number(cust.customer_tel),
        customer_tel_alt: Number(cust.customer_tel_alt),
        customer_obs: noData(cust.customer_obs),
    }
}

export const customers = (customers) => {
    let arr = []
    customers.forEach(c => {
        arr.push(customer(c))
    })
    return arr
}

export const putEditCustomer = (cid, c) => {
    return {
        id: Number(cid),
        name: noData(c.customer_name),
        lastname: noData(c.customer_lastname),
        dni: Number(c.customer_dni),
        tel: Number(c.customer_tel),
        tel_alt: Number(c.customer_tel_alt),
        email: noData(c.customer_email.toLowerCase()),
        obs: noData(c.customer_obs)
    }
}