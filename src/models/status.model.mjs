import { pool } from "../config/connectionDB.mjs";

function strToNum(input) { return input.split(',').map(Number) }

export const getStatusHistoryDB = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            BIN_TO_UUID(osh.order_id) AS order_id,
            BIN_TO_UUID(osh.created_by) AS created_by,
            osh.created_at,
            osh.osh_current,
            osc.osc_category,
            osc.osc_detail,
            osc.osc_type,
            u.user_name,
            u.user_lastname
        FROM
            order_status_history osh
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        INNER JOIN
            users u ON osh.created_by = u.user_id
        WHERE
            BIN_TO_UUID(osh.order_id) = ?
        ORDER BY osh.created_at DESC`

        const [result] = await connection.query(query, oid)
        return (result)
    } catch (error) {
        console.error('---[ERROR] model/getStatusLogDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const getLastStatusDB = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            BIN_TO_UUID(osh.order_id) AS order_id,
            BIN_TO_UUID(osh.created_by) AS created_by,
            osh.created_at,
            osh.osh_current,
            osh.osc_id,
            osc.osc_category,
            osc.osc_detail,
            osc.osc_type,
            osc.osc_next_status
        FROM
            order_status_history osh
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        WHERE
            BIN_TO_UUID(osh.order_id) = ? AND osh.osh_current = 1
        `


        const [[result]] = await connection.query(query, oid)

        const str = (strToNum(result.osc_next_status))
        const query2 = `SELECT * FROM order_status_code WHERE osc_id IN (${str})`
        const [result2] = await connection.query(query2, str)


        return ({ actual_status: result, next_status: result2 })
    } catch (error) {
        console.error('---[ERROR] model/getLastStatus: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const insertNextStatusDB = async (data) => {
    const statusUpdates = {
        '450': "UPDATE orders SET order_repaired = 1 WHERE BIN_TO_UUID(order_id) = ?",
        '460': "UPDATE orders SET order_repaired = 2 WHERE BIN_TO_UUID(order_id) = ?",
        '470': "UPDATE orders SET order_repaired = 0 WHERE BIN_TO_UUID(order_id) = ?",
        '220': "UPDATE orders SET order_repaired = 0 WHERE BIN_TO_UUID(order_id) = ?",
        '700': "UPDATE orders SET order_finished = 1 WHERE BIN_TO_UUID(order_id) = ?",
        '730': "UPDATE orders SET order_finished = 1 WHERE BIN_TO_UUID(order_id) = ?"
    };

    const connection = await pool.getConnection()
    try {
        //Iniciar transacción
        await connection.beginTransaction()

        const queryUpdate = "UPDATE order_status_history SET osh_current = 0 WHERE BIN_TO_UUID(order_id) = ? AND osh_current = 1;"
        const queryInsert = `INSERT INTO order_status_history (order_id, osc_id, created_by) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?))`
        const params = [data.order_id, data.next_status, data.user_id]

        await connection.query(queryUpdate, data.order_id)
        await connection.query(queryInsert, params)

        //Actualiza los campos "finished" o "repaired" de la orden segun el estado
        const queryOrder = statusUpdates[data.next_status];
        if (queryOrder) {await connection.query(queryOrder, data.order_id)}

        //Finaliza transaccion
        await connection.commit()
        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/nextStatus: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}