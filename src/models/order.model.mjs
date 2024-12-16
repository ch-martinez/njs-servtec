import { pool } from "../config/connectionDB.mjs";

export const getAllOrdersFromDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        o.order_id,
        o.order_ticket,
        o.order_failure,
        o.created_at,
        c.customer_id,
        c.customer_name,
        c.customer_lastname
    FROM
        orders o
    INNER JOIN
        customers c ON c.customer_id = o.customer_id
    `

    try {
        const [rows] = await connection.query(query)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllOrdersFromDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const allCustomerOrdersDB = async (cid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        o.order_id,
        o.order_ticket,
        o.order_failure,
        o.created_at
    FROM
        orders o
    WHERE
        o.customer_id = ?
    `

    try {
        const [rows] = await connection.query(query, cid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/allCustomerOrdersDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const allUserOrdersDB = async (uid) => {
    const connection = await pool.getConnection()
    const query = `
        SELECT
            o.order_id,
            o.order_ticket,
            o.order_failure,
            o.created_at
        FROM
            orders o
        JOIN
            order_status AS OS ON os.order_id = o.order_id
        WHERE
            os.created_by = ?
        GROUP BY o.order_id`

    try {
        const [rows] = await connection.query(query, uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/allCustomerOrdersDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const insertOrderInDB = async (data) => {
    const connection = await pool.getConnection()
    const queryOrder = `
        INSERT INTO orders (
            customer_id,
            order_ticket,
            db_id,
            dm_id,
            dm_other,
            order_imei,
            order_pin,
            order_failure,
            order_comment_atc,
            order_budget,
            order_comment_budget,
            order_prepaid,
            pm_id)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    const paramsOrder = [
        data.customer_id,
        data.order_ticket,
        data.db_id,
        data.dm_id,
        data.dm_other,
        data.order_imei,
        data.order_pin,
        data.order_failure,
        data.order_comment_atc,
        data.order_budget,
        data.order_comment_budget,
        data.order_prepaid,
        data.pm_id
    ]

    const queryStatus = "INSERT INTO order_status (order_id, created_by, os_status_code) VALUES (?, ?, 100)"
    const queryStatus2 = "INSERT INTO order_status (order_id, created_by, os_status_code) VALUES (?, ?, 110)"

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        const [insertRes] = await connection.query(queryOrder, paramsOrder)
        const oid = insertRes.insertId
        await connection.query(queryStatus, [oid, data.uid])
        setTimeout(async () => {
            await connection.query(queryStatus2, [oid, data.uid])
        }, 1000);
        //Finaliza transaccion
        await connection.commit()

        return ({ status: true, order_id: insertRes.insertId })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/insertOrderInDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const insertWarrantyInDB = async (data) => {
    const connection = await pool.getConnection()
    const queryOrder = `
        INSERT INTO orders (
            customer_id,
            db_id,
            dm_id,
            dm_other,
            order_imei,
            order_warranty,
            order_warranty_id,
            order_ticket,
            order_pin,
            order_failure,
            order_comment_atc
            )
        SELECT
            o2.customer_id,
            o2.db_id,
            o2.dm_id,
            o2.dm_other,
            o2.order_imei,
            true,
            ?,
            ?,
            ?,
            ?,
            ?
        FROM
            orders o2
        WHERE
            o2.order_id = ?`

    const paramsOrder = [
        data.order_warranty_id,
        data.order_ticket,
        data.order_pin,
        data.order_failure,
        data.order_comment_atc,
        data.order_warranty_id
    ]
    try {
        //Iniciar transacción
        await connection.beginTransaction();

        const [insertRes] = await connection.query(queryOrder, paramsOrder)
        console.log(data)
        //Finaliza transaccion
        await connection.commit()

        return ({ status: true, order_id: insertRes.insertId })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/insertOrderInDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const getOrderByFromDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        o.customer_id,
        o.order_id,
        o.order_ticket,
        o.order_warranty,
        o.order_warranty_id,
        o.order_imei,
        o.order_pin,
        o.order_failure,
        o.order_comment_atc,
        o.order_comment_tec,
        o.order_comment_extra,
        o.order_budget,
        o.order_comment_budget,
        o.order_prepaid,
        o.order_auth,
        o.order_auth_name,
        o.order_auth_dni,
        o.created_at,
        o.db_id,
        db.db_name,
        o.dm_id,
        dm.dm_model,
        o.dm_other,
        o.pm_id,
        pm.pm_name,
        o2.order_ticket as warranty_ticket
    FROM orders o
    INNER JOIN devices_models dm ON dm.dm_id = o.dm_id
    INNER JOIN devices_brands db ON db.db_id = o.db_id
    LEFT JOIN payments_methods pm ON pm.pm_id = o.pm_id
    LEFT JOIN orders o2 on o2.order_id = o.order_warranty_id
    WHERE
        o.order_id = ?`

    try {
        const [[resp]] = await connection.query(query, oid)
        return resp
    } catch (error) {
        console.error('---[ERROR] model/getOrderByFromDB: ', error.message)
    } finally {
        if (connection) connection.release()
    }
}

export const getTicketByIdFromDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `SELECT order_ticket FROM orders WHERE order_id = ?`

    try {
        const [[resp]] = await connection.query(query, oid)
        return resp.order_ticket
    } catch (error) {
        console.error('---[ERROR] model/getTicketByIdFromDB: ', error.message)
        return ('')
    } finally {
        if (connection) connection.release()
    }
}

export const orderHasWarrantyInDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `
        SELECT
            o.order_id,
            o2.order_ticket
        FROM orders o
        LEFT JOIN orders o2 ON o.order_warranty_id = o2.order_id
        WHERE o.order_warranty_id = ?`

    try {
        const [[resp]] = await connection.query(query, oid)

        if (resp == null) {
            return {
                status: false
            }
        } else {
            return {
                status: true,
                order_id: resp.order_id,
                order_ticket: resp.order_ticket
            }
        }
        return {}
    } catch (error) {
        console.error('---[ERROR] model/orderHasWarrantyInDB: ', error.message)
        return ('')
    } finally {
        if (connection) connection.release()
    }
}


export const updateOrderInDB = async (order) => {
    const connection = await pool.getConnection()

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        const queryOrder = `
            UPDATE orders
            SET
                db_id = ?,
                dm_id = ?,
                dm_other = ?,
                order_imei = ?,
                order_pin = ?,
                order_failure = ?,
                order_comment_atc = ?,
                order_comment_tec = ?,
                order_comment_extra = ?,
                order_budget = ?,
                order_comment_budget = ?,
                order_prepaid = ?,
                pm_id = ?
            WHERE
                order_id = ?`

        const paramsOrder = [
            order.db_id,
            order.dm_id,
            order.dm_other,
            order.order_imei,
            order.order_pin,
            order.order_failure,
            order.order_comment_atc,
            order.order_comment_tec,
            order.order_comment_extra,
            order.order_budget,
            order.order_comment_budget,
            order.order_prepaid,
            order.pm_id,
            order.order_id
        ]

        await connection.query(queryOrder, paramsOrder)

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/updateOrderInDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}