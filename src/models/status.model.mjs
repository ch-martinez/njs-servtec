import { pool } from "../config/connectionDB.mjs";

function strToNum(input) { return input.split(',').map(Number) }

export const getStatusHistoryDB = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            osh.*,
            osc.osc_description,
            u.user_name,
            u.user_lastname
        FROM
            order_status_history osh
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        INNER JOIN
            users u ON osh.created_by = u.user_id
        WHERE
            osh.order_id = ?
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
            osh.*,
            osc.osc_description,
            osc.osc_next_status
        FROM
            order_status_history osh
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        WHERE
            osh.order_id = ? AND osh.osh_current = 1
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
    const connection = await pool.getConnection()
    try {
        //Iniciar transacción
        await connection.beginTransaction()

        const queryUpdate = "UPDATE order_status_history SET osh_current = 0 WHERE order_id = ? AND osh_current = 1;"
        const queryInsert = `INSERT INTO order_status_history (order_id, osc_id, created_by) VALUES (?, ?, ?)`
        const params = [data.order_id, data.next_status, data.user_id]

        await connection.query(queryUpdate, data.order_id)
        await connection.query(queryInsert, params)

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