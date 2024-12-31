import { pool } from "../config/connectionDB.mjs";

export const getAllOrdersDB = async (filters) => {
    const connection = await pool.getConnection()
    let query = `
    SELECT
        BIN_TO_UUID(o.order_id) AS order_id,
        o.order_ticket,
        o.order_failure,
        o.created_at,
        BIN_TO_UUID(c.customer_id) AS customer_id,
        c.customer_name,
        c.customer_lastname,
        osc.osc_description
    FROM
        orders o
    INNER JOIN
        customers c ON c.customer_id = o.customer_id
    INNER JOIN
        order_status_history osh ON osh.order_id = o.order_id
    INNER JOIN
        order_status_code osc ON osh.osc_id = osc.osc_id
    WHERE osh.osh_current = 1`
    let filterParams = []

    if (filters?.status) {
        query += ` AND osh.osc_id = ?;`
        filterParams.push(filters.status)
    }

    try {
/*      console.log('---[INFO] model/getAllOrdersDB: ', query)
        console.log('---[INFO] model/getAllOrdersDB: ', filterParams)
        console.log('---[INFO] model/getAllOrdersDB: ', filters) */
        const [rows] = await connection.query(query, filterParams)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllOrdersDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const getAllCustomerOrdersDB = async (cid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        BIN_TO_UUID(o.order_id) AS order_id,
        o.order_ticket,
        o.order_failure,
        BIN_TO_UUID(c.customer_id) AS customer_id,
        c.customer_name,
        c.customer_lastname,
        osc.osc_description,
        osh.created_at
    FROM
        orders o
    INNER JOIN
        customers c ON c.customer_id = o.customer_id
    INNER JOIN
        order_status_history osh ON osh.order_id = o.order_id
    INNER JOIN
        order_status_code osc ON osh.osc_id = osc.osc_id
    WHERE osh.osh_current = 1 AND c.customer_id = UUID_TO_BIN(?)
    ORDER BY osh.created_at DESC`

    try {
        const [rows] = await connection.query(query, cid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllCustomerOrdersDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const getAllUserOrdersDB = async (uid) => {
    const connection = await pool.getConnection()
    const query = `
        WITH rel_order AS (
            SELECT
                osh.order_id
            FROM
                order_status_history osh
            WHERE
                osh.created_by = UUID_TO_BIN(?)
            GROUP BY osh.order_id
        )

        SELECT
            BIN_TO_UUID(o.order_id) AS order_id,
            o.order_ticket,
            o.order_failure,
            BIN_TO_UUID(c.customer_id) AS customer_id,
            c.customer_name,
            c.customer_lastname,
            osc.osc_description,
            osh.created_at
        FROM rel_order AS r
        INNER JOIN
        orders o ON o.order_id = r.order_id
        INNER JOIN
            customers c ON c.customer_id = o.customer_id
        INNER JOIN
            order_status_history osh ON osh.order_id = o.order_id
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        WHERE osh.osh_current = 1
        ORDER BY osh.created_at DESC`

    try {
        const [rows] = await connection.query(query, uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllUserOrdersDB: ', error.message)
    } finally {
        if (connection) connection.release()
    }
}

export const insertOrderDB = async (data) => {
    const connection = await pool.getConnection()
    const queryOrder = `
        INSERT INTO orders (
            order_id,
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
            order_budget_detail,
            order_prepaid,
            pm_id)
        VALUES
            (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
    const paramsOrder = [
        data.order_id,
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
        data.order_budget_detail,
        data.order_prepaid,
        data.pm_id
    ]

    const queryStatus = "INSERT INTO order_status_history (order_id, created_by, osc_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), 100)"
    //    const queryStatus2 = "INSERT INTO order_status_history (order_id, created_by, osc_id) VALUES (?, ?, 110)"

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        await connection.query(queryOrder, paramsOrder)

        await connection.query(queryStatus, [data.order_id, data.uid])
        // TODO CONTINUAR ACA
        /*         setTimeout(async () => {
                    await connection.query(queryStatus2, [oid, data.uid])
                    console.log("ingreso")
                }, 1000); */

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/insertOrderDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const insertWarrantyDB = async (data) => {
    const connection = await pool.getConnection()
    const queryOrder = `
        INSERT INTO orders (
            customer_id,
            db_id,
            dm_id,
            dm_other,
            order_imei,
            order_ticket,
            order_pin,
            order_failure,
            order_comment_atc,
            order_id
            )
        SELECT
            o2.customer_id,
            o2.db_id,
            o2.dm_id,
            o2.dm_other,
            o2.order_imei,
            ?,
            ?,
            ?,
            ?,
            UUID_TO_BIN(?)
        FROM
            orders o2
        WHERE
            BIN_TO_UUID(o2.order_id) = ?`

    const paramsOrder = [
        data.order_ticket,
        data.order_pin,
        data.order_failure,
        data.order_comment_atc,
        data.warranty_id,
        data.main_id
    ]
    try {
        //Iniciar transacción
        await connection.beginTransaction();

        await connection.query(queryOrder, paramsOrder)

        const queryStatus = "INSERT INTO order_status_history (order_id, created_by, osc_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), 100)"

        await connection.query(queryStatus, [data.warranty_id, data.uid])

        const queryWarranty = "INSERT INTO order_warranty (ow_main_id, ow_warranty_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?))"
        await connection.query(queryWarranty, [data.main_id, data.warranty_id])

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/insertWarrantyDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const getOrderDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        BIN_TO_UUID(o.customer_id) as customer_id,
        BIN_TO_UUID(o.order_id) as order_id,
        o.order_ticket,
        o.order_imei,
        o.order_pin,
        o.order_failure,
        o.order_comment_atc,
        o.order_comment_tec,
        o.order_comment_extra,
        o.order_budget,
        o.order_budget_detail,
        o.order_prepaid,
        o.order_auth,
        o.order_auth_name,
        o.order_auth_dni,
        o.created_at,
        o.order_repaired,
        o.order_finished,
        o.db_id,
        db.db_name,
        o.dm_id,
        dm.dm_model,
        o.dm_other,
        o.pm_id,
        pm.pm_name
    FROM orders o
    INNER JOIN devices_models dm ON dm.dm_id = o.dm_id
    INNER JOIN devices_brands db ON db.db_id = o.db_id
    LEFT JOIN payments_methods pm ON pm.pm_id = o.pm_id
    WHERE
        BIN_TO_UUID(o.order_id) = ?`

    try {
        const [[resp]] = await connection.query(query, oid)
        return resp
    } catch (error) {
        console.error('---[ERROR] model/getOrderDB: ', error.message)
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

export const hasWarrantyDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `
        SELECT
            BIN_TO_UUID(ow.ow_warranty_id) AS warranty_id,
            BIN_TO_UUID(ow.ow_main_id) AS main_id
        FROM
            order_warranty ow
        WHERE
            BIN_TO_UUID(ow.ow_main_id) = ?`

    try {
        const [[resp]] = await connection.query(query, oid)

        if (resp == null) {
            return {
                status: false
            }
        } else {
            return {
                status: true,
                warranty_id: resp.warranty_id
            }
        }
        return {}
    } catch (error) {
        console.error('---[ERROR] model/hasWarrantyDB: ', error.message)
        return ('')
    } finally {
        if (connection) connection.release()
    }
}

export const isWarrantyDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `
        SELECT
            o.order_id,
            o.order_ticket
        FROM
            order_warranty ow
        INNER JOIN
            orders o ON o.order_id = ow.ow_main_id
        WHERE
            ow.ow_warranty_id = ?`

    try {
        const [[resp]] = await connection.query(query, oid)

        if (resp == null) {
            return {
                is_warranty: false
            }
        } else {
            return {
                is_warranty: true,
                main_id: resp.order_id,
                main_ticket: resp.order_ticket
            }
        }
        return {}
    } catch (error) {
        console.error('---[ERROR] model/isWarrantyDB: ', error.message)
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
                order_budget_detail = ?,
                order_prepaid = ?,
                pm_id = ?
            WHERE
                BIN_TO_UUID(order_id) = ?`

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
            order.order_budget_detail,
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
        console.error(error.sql);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}

export const getAuthOrderDB = async (oid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        order_auth,
        order_auth_name,
        order_auth_lastname,
        order_auth_dni
    FROM
        orders
    WHERE
        BIN_TO_UUID(order_id) = ?`

    try {
        const [[resp]] = await connection.query(query, oid)
        return resp
    } catch (error) {
        console.error('---[ERROR] model/getAuthOrderDB: ', error.message)
    } finally {
        if (connection) connection.release()
    }
}

export const updateAuthOrderDB = async (order) => {
    const connection = await pool.getConnection()

    const queryOrder = `
                UPDATE orders
                SET
                    order_auth = ?,
                    order_auth_name = ?,
                    order_auth_lastname = ?,
                    order_auth_dni = ?
                WHERE
                    BIN_TO_UUID(order_id) = ?`

    const paramsOrder = [
        order.auth.auth,
        order.auth.auth_name,
        order.auth.auth_lastname,
        order.auth.auth_dni,
        order.order_id,
    ]

    const queryStatus = "INSERT INTO order_status_history (order_id, created_by, osc_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), 810)"
    const paramsStatus = [order.order_id, order.user_id]

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        await connection.query(queryOrder, paramsOrder)
        await connection.query(queryStatus, paramsStatus)

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/updateAuthOrderDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}

export const deleteOrderDB = async (oid) => {
    const connection = await pool.getConnection()

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        await connection.query("DELETE FROM orders WHERE BIN_TO_UUID(order_id) = ?", oid)

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/deleteOrderDB: ', error.message);
        //errno: 1451 = Error de integridad referencial
        return ({ status: false, error: error.errno })
    } finally {
        if (connection) { connection.release() }
    }
}