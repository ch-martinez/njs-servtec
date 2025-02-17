import { pool } from "../config/connectionDB.mjs";

export const insertOrderImageDB = async (data) => {
    const connection = await pool.getConnection()
    const query = `
        INSERT INTO order_images
        (
            order_id,
            oi_filename,
            oi_type,
            created_by
        )

        VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?))`

    const params = [
        data.order_id,
        data.fileName,
        data.type,
        data.uid
    ]

    try {
        await connection.query(query, params)
        return ({ status: true })
    } catch (error) {
        console.error('---[ERROR] model/insertOrderImageDB: ', error.message)
        return ({ status: false , error: error.errno})
    } finally {
        if (connection) connection.release()
    }
}