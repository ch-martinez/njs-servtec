import { pool } from "../config/connectionDB.mjs";

export const getAllPMfromDB = async () => {
    const connection = await pool.getConnection()

    const query = `SELECT * FROM payments_methods`

    try {
        const [resp] = await connection.query(query)
        return {status: true, data: resp}
    } catch (error) {
        console.error('---[ERROR] model/getAllPMfromDB: ', error.message);
        return {status: false}
    } finally {
        if (connection) connection.release()
    }
}