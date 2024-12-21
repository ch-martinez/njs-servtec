import { fullDateStr } from "./date.formarter.mjs";
import { noData } from "./general.formarter.mjs";

const staus_code = {
    10: "Recepcion: Orden creada e ingreso registrado",
    11: "Recepcion: Pendiente de envío a taller",

    20: "Taller: Recibe",
    21: "Taller: En revisión y evaluación",
    22: "Taller: No reparable",

    30: "Presupuesto: Realizado",
    31: "Presupuesto: Notificado",

    33: "Presupuesto: Revision a pedido del cliente",
    34: "Presupuesto: APROBADO",
    35: "Presupuesto: RECHAZADO",

    41: "Reparacion: Pendiente",
    42: "Reparacion: Pendiente repuesto",
    43: "Reparacion: En curso",

    45: "Reparacion: Parcial",
    46: "Reparacion: Reparado",
    47: "Reparacion: No reparado",

    60: "Entrega: Pendiente",
    61: "Entrega: Pendiente - 7 dias",
    62: "Entrega: Pendiente - 15 dias",
    63: "Entrega: Pendiente - 1 Mes",
    64: "Entrega: Pendiente - 3 Meses",

    70: "Entregado: Reparado parcial",
    71: "Entregado: Reparado",
    72: "Entregado: No reparado",
    73: "No entregado: Abandono",

    90: "ORDEN FINALIZADA"
}

export const statusHistory = (statusHistory) => {
    let arr = []

    statusHistory.forEach(s => {
        arr.push({
            id: s.os_id,
            status_code: s.os_status_code,
            description: s.osc_description,
            created: fullDateStr(s.created_at),
            current: s.osh_current == 0 ? false : true,
            user: {
                id: s.created_by,
                name: s.user_name,
                lastname: s.user_lastname
            }
        })
    })

    return arr
}

export const lastStatus = (data) => {
    let arr = []

    data.next_status.forEach(s => {
        arr.push({
            id: s.osc_id,
            description: s.osc_description
        })
    })

    return {
        actual:{
            id: data.actual_status.osc_id,
            description: data.actual_status.osc_description
        },
        next: arr
    }
}

export const postNextStatus = (oid, uid, ns) => {
    return {
        order_id: Number(oid),
        user_id: Number(uid),
        next_status: Number(ns)
    }
}

export const postAuthOrder = (uid, oid, auth) => {
    return {
        order_id: Number(oid),
        user_id: Number(uid),
        auth: {
            auth_auth: true,
            auth_name: noData(auth.auth_name),
            auth_lastname: noData(auth.auth_lastname),
            auth_dni: Number(auth.auth_dni)
        }
    }
}