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

export const insertOrderInDB = async (data) => {
    const connection = await pool.getConnection()
    const queryOrder = `
        INSERT INTO orders (
            customer_id,
            order_ticket,
            order_warranty,
            order_warranty_id,
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
            order_payment_method)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    const paramsOrder = [
        data.customer_id,
        data.order_ticket,
        data.order_warranty,
        data.order_warranty_id,
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
        data.order_payment_method
    ]
    try {
        //Iniciar transacción
        await connection.beginTransaction();

        const [insertRes] = await connection.query(queryOrder, paramsOrder)

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true, order_id: insertRes.insertId })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/updateUserInDB: ', error.message);
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
        o.order_payment_method,
        o.order_auth,
        o.order_auth_name,
        o.order_auth_dni,
        o.created_at,
        db.db_name,
        dm.dm_model,
        o.dm_other
    FROM orders o
    INNER JOIN devices_models dm ON dm.dm_id = o.dm_id
    INNER JOIN devices_brands db ON db.db_id = o.db_id
    WHERE
        order_id = ?`

    try {
        const [[resp]] = await connection.query(query,oid)
        return resp
    } catch (error) {
        console.error('---[ERROR] model/getOrderByFromDB: ', error.message)
    } finally {
        if (connection) connection.release()
    }
}