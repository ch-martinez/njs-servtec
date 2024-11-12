export const orders = (orderList) => {

    const order = (order) => {
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
            temp.push(order(order))
        })
    }

    return temp
}