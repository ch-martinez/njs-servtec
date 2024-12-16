import { pool } from "../config/connectionDB.mjs";

function strToNum(input) { return input.split(',').map(Number) }


export const getStatusLogDB = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            os.*,
            osc.osc_description,
            u.user_name,
            u.user_lastname
        FROM
            order_status os
        INNER JOIN
            order_status_code osc ON os.os_status_code = osc.osc_id
        INNER JOIN
            users u ON os.created_by = u.user_id
        WHERE
            os.order_id = ?
        ORDER BY os.created_at DESC`

        const [result] = await connection.query(query, oid)
        return (result)
    } catch (error) {
        console.error('---[ERROR] model/getStatusLogDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const getLastStatus = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            os.*,
            osc.osc_description,
            osc.osc_next_status
        FROM
            order_status os
        INNER JOIN
            order_status_code osc ON os.os_status_code = osc.osc_id
        WHERE
            os.order_id = ?
        ORDER BY os.created_at DESC LIMIT 1`


        const [[result]] = await connection.query(query, oid)

        const str = (strToNum(result.osc_next_status))
        const query2 = `SELECT * FROM order_status_code WHERE osc_id IN (${str})`
        const [result2] = await connection.query(query2, str)


        return ({actual: result, next: result2})
    } catch (error) {
        console.error('---[ERROR] model/getLastStatus: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const nextStatus = async (data) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        INSERT INTO order_status
            (order_id, os_status_code, created_by)
        VALUES
            (?, ?, ?)
        `
        const params = [data.oid, data.next_status, data.uid]
        await connection.query(query, params)
        return ({status: true})
    } catch (error) {
        console.error('---[ERROR] model/nextStatus: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}