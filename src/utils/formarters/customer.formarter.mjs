import { dateFull } from "./date.formarter.mjs"

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
        disabled: cust.disabled == 0 ? false : true,
        disabled_at: cust.disabled_at,
        deleted: cust.deleted == 0 ? false : true,
        deleted_user_id: cust.deleted_user_id,
        deleted_at: cust.deleted_at
    }
}

export const customersList = (custList) => {
    let temp = []
    custList.forEach(cust => {
        temp.push(customer(cust))
    })
    return temp
}