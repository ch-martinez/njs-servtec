import { fullDateStr } from "./date.formarter.mjs";
import { noData } from "./general.formarter.mjs";

export const statusHistory = (statusHistory) => {
    let arr = []

    statusHistory.forEach(s => {
        arr.push({
            id: s.os_id,
            status_code: s.os_status_code,
            description: `${s.osc_category} - ${s.osc_detail}`,
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
            description: `${s.osc_category} - ${s.osc_detail}`,
        })
    })

    return {
        actual:{
            id: data.actual_status.osc_id,
            description: `${data.actual_status.osc_category} - ${data.actual_status.osc_detail}`,
        },
        next: arr
    }
}

export const postNextStatus = (oid, uid, ns) => {
    return {
        order_id: oid,
        user_id: uid,
        next_status: Number(ns),
    }
}

export const nextStatusData = (data) => {
    return{
        budget: {
            budget: Number(data.order_budget) || null,
            detail: data.order_budget_detail || null
        },
        comment: {
            comment: data.order_comment || null,
            type: data.type || null
        }
    }
}
