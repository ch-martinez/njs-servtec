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
        console.log('---[ERROR] model/getAllOrdersFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}