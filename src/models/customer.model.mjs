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
        console.log('---[ERROR] model/getAllCustomersFromDB: ', error)
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
        console.log('---[ERROR] model/getCustomerByIdFromDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}


export const insertCustomerInDB = async (data) => {
    const connection = await pool.getConnection()
    const query = `
        INSERT INTO customers
        (
            customer_name ,
            customer_lastname ,
            customer_dni ,
            customer_email ,
            customer_tel ,
            customer_tel_alt ,
            customer_obs
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)`

    const params = [
        data.customer_name,
        data.customer_lastname,
        data.customer_dni,
        data.customer_email,
        data.customer_tel,
        data.customer_tel_alt,
        data.customer_obs
    ]

    try {
        const [insertRes] = await connection.query(query, params)
        return ({ status: true, customer_id: insertRes.insertId })
    } catch (error) {
        console.error('---[ERROR] model/getCustomerByIdFromDB: ', error.msg)
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const updateCustomerInDB = async (cid, customer) => {
    const connection = await pool.getConnection()

    const query = `
        UPDATE customers
        SET
            customer_name = ?,
            customer_lastname = ?,
            customer_dni = ?,
            customer_email = ?,
            customer_tel = ?,
            customer_tel_alt = ?,
            customer_obs = ?
        WHERE
            customer_id = ?`

    const params = [
        customer.customer_name,
        customer.customer_lastname,
        customer.customer_dni,
        customer.customer_email,
        customer.customer_tel,
        customer.customer_tel_alt,
        customer.customer_obs,
        cid
    ]

    try {
        await connection.query(query, params)
        return ({ status: true })
    } catch (error) {
        console.error('---[ERROR] model/updateCustomerInDB: ', error.msg)
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}


export const statusCustomerInDB = async (customer) => {
    const connection = await pool.getConnection()

    const query = `UPDATE customers SET customer_status = ?, status_at = current_timestamp WHERE customer_id = ?`
    const params = [customer.status, customer.id]

    try {
        await connection.query(query, params)
        return({status: true})
    } catch (error) {
        console.error('---[ERROR] model/statusCustomerInDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}