import { pool } from "../config/connectionDB.mjs";

export const getAllDevicesBrandsFromDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        *
    FROM
        devices_brands
    ORDER BY db_name ASC`

    try {
        const [rows] = await connection.query(query)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllDevicesBrandsFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}

export const getAllModelsByBrandIdFromDB = async (bid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        dm_id, dm_model
    FROM
        devices_models
    WHERE
        db_id = ?
    ORDER BY dm_model ASC`

    try {
        const [rows] = await connection.query(query, bid)
        return rows
    } catch (error) {
        console.error('---[ERROR] model/getAllModelsByBrandIdFromDB: ',error.msg)
    } finally {
        if (connection) connection.release()
    }
}