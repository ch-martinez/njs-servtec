import { pool } from "../config/connectionDB.mjs";

export const getUserAllFromDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        u.user_id ,
        user_name,
        user_dni,
        user_lastname,
        user_email,
        user_password,
        user_status,
        u.created_at,
        u.updated_at,
        u.deleted_at,
        r.role_id,
        role_name,
        role_code
    FROM
        users u
    INNER JOIN
        user_has_role uhr ON u.user_id = uhr.user_id
    INNER JOIN
        roles r ON r.role_id = uhr.role_id `

    try {
        const [rows] = await connection.query(query)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getUserAll: ',error)
    } finally {
        if (connection) connection.release()
    }
}

export const getUserByIdFromDB = async (uid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        user_id ,
        user_name,
        user_dni,
        user_lastname,
        user_email,
        user_password,
        user_status,
        created_at,
        updated_at,
        deleted_at
    FROM
        users u
    WHERE
        user_id = ?`

    try {
        const [[rows]] = await connection.query(query,uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getUserAll: ',error)
    } finally {
        if (connection) connection.release()
    }
}