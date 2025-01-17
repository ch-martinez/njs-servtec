import { pool } from "../config/connectionDB.mjs";

export const getUserLoginDB = async (uid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        ul.ul_login
    FROM
        users_login ul
    INNER JOIN
        users u ON u.user_id = ul.user_id
    WHERE
        BIN_TO_UUID(u.user_id) = ?
    ORDER BY ul.ul_login DESC`

    try {
        const [rows] = await connection.query(query,uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getUserLoginByIdFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}