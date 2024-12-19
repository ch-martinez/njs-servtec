import { pool } from "../config/connectionDB.mjs";

export const getUserRoleDB = async (uid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        r.*
    FROM
        roles r
    INNER JOIN
        user_has_role uhr ON uhr.role_id = r.role_id
    INNER JOIN
        users u ON u.user_id = uhr.user_id

    WHERE u.user_id = ?`

    try {
        const [[rows]] = await connection.query(query, uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getUserAll: ',error)
    } finally {
        if (connection) connection.release()
    }
}

export const getAllRolesDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        r.*
    FROM
        roles r`

    try {
        const [rows] = await connection.query(query)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllRolesFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}