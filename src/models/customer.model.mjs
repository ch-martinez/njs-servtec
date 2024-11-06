import { pool } from "../config/connectionDB.mjs";

export const getAllCustomersFromDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        c.*
    FROM
        customers c
    WHERE c.deleted = 0`

    try {
        const [rows] = await connection.query(query)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllCustomersFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}

export const getCustomerByIdFromDB = async (cid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        c.*
    FROM
        customers c
    WHERE c.customer_id = ?`

    try {
        const [[rows]] = await connection.query(query, cid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getCustomerByIdFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}