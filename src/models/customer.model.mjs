import { pool } from "../config/connectionDB.mjs";

export const getAllCustomersDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        BIN_TO_UUID(c.customer_id) as customer_id,
        c.customer_name,
        c.customer_lastname,
        c.customer_dni,
        c.customer_email,
        c.customer_tel,
        c.customer_status
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

export const getCustomerDB = async (cid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        BIN_TO_UUID(c.customer_id) as customer_id,
        c.customer_name,
        c.customer_lastname,
        c.customer_dni,
        c.customer_email,
        c.customer_tel,
        c.customer_tel_alt,
        c.customer_obs,
        c.customer_status,
        c.created_at,
        c.updated_at,
        c.status_at,
        c.deleted,
        c.deleted_by,
        c.deleted_at
    FROM
        customers c
    WHERE BIN_TO_UUID(c.customer_id) = ?`

    try {
        const [[rows]] = await connection.query(query, cid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getCustomerByIdFromDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}


export const insertCustomerDB = async (data) => {
    const connection = await pool.getConnection()
    const query = `
        INSERT INTO customers
        (
            customer_id ,
            customer_name ,
            customer_lastname ,
            customer_dni ,
            customer_email ,
            customer_tel ,
            customer_tel_alt ,
            customer_obs,
            created_by
        )

        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))`

    const params = [
        data.customer_id,
        data.customer_name,
        data.customer_lastname,
        data.customer_dni,
        data.customer_email,
        data.customer_tel,
        data.customer_tel_alt,
        data.customer_obs,
        data.created_by
    ]

    try {
        const [insertRes] = await connection.query(query, params)
        return ({ status: true, customer_id: insertRes.insertId })
    } catch (error) {
        console.error('---[ERROR] model/insertCustomerDB: ', error.message)
        return ({ status: false , error: error.errno})
    } finally {
        if (connection) connection.release()
    }
}

export const updateCustomerDB = async (customer) => {
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
            BIN_TO_UUID(customer_id) = ?`

    const params = [
        customer.name,
        customer.lastname,
        customer.dni,
        customer.email,
        customer.tel,
        customer.tel_alt,
        customer.obs,
        customer.id
    ]

    try {
        await connection.query(query, params)
        return ({ status: true })
    } catch (error) {
        console.error('---[ERROR] model/updateCustomerDB: ', error.message)
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}


export const updateCustomerStatusDB = async (customer) => {
    const connection = await pool.getConnection()

    const query = `UPDATE customers SET customer_status = ?, status_at = current_timestamp WHERE BIN_TO_UUID(customer_id) = ?`
    const params = [customer.status, customer.id]

    try {
        await connection.query(query, params)
        return({status: true})
    } catch (error) {
        console.error('---[ERROR] model/updateCustomerStatusDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}