import { dateFull } from "./date.formarter.mjs"
import { sd } from "./general.formarter.mjs"

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
        created_at: dateFull(cust.created_at),
        updated_at: dateFull(cust.updated_at),
        status: cust.customer_status == 1,
        status_at: cust.status_at,
        deleted: cust.deleted == 0 ? false : true,
        deleted_user_id: cust.deleted_user_id,
        deleted_at: cust.deleted_at
    }
}

export const customerNewPost = (cust) => {
    return {
        customer_id: cust.customer_id,
        customer_name: cust.customer_name,
        customer_lastname: cust.customer_lastname,
        customer_email: (cust.customer_email).toLowerCase(),
        customer_dni: cust.customer_dni,
        customer_tel: cust.customer_tel,
        customer_tel_alt: cust.customer_tel_alt,
        customer_obs: cust.customer_obs,
    }
}

export const customersList = (custList) => {
    let temp = []
    custList.forEach(cust => {
        temp.push(customer(cust))
    })
    return temp
}

export const update = (cid, c) => {
    return {
        id: Number(cid),
        name: sd(c.customer_name),
        lastname: sd(c.customer_lastname),
        dni: Number(c.customer_dni),
        tel: Number(c.customer_tel),
        tel_alt: Number(c.customer_tel_alt),
        email: sd(c.customer_email),
        obs: sd(c.customer_obs)
    }
}