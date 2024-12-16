import { dateFull } from "./date.formarter.mjs";

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

export const statusLog = (status_log) => {
    let arr = []

    status_log.forEach(status => {
        arr.push({
            id: status.os_id,
            status_code: status.os_status_code,
            description: status.osc_description,
            created: dateFull(status.created_at),
            user: {
                id: status.created_by,
                name: status.user_name,
                lastname: status.user_lastname
            }
        })
    })

    return arr
}

export const lastStatus = (data) => {
    let arr = []

    data.next.forEach(s => {
        arr.push({
            id: s.osc_id,
            description: s.osc_description
        })
    })

    return {
        actual:{
            id: data.actual.os_status_code,
            description: data.actual.osc_description
        },
        next: arr
    }
}

export const nextStatus = (oid, uid, ns) => {
    return {
        order_id: oid,
        user_id: uid,
        next_status: ns
    }
}