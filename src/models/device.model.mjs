import { pool } from "../config/connectionDB.mjs";

export const getAllDevicesBrandsFromDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        *
    FROM
        devices_brands
    `

    try {
        const [rows] = await connection.query(query)
        console.log(rows)
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
        console.log(rows)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getAllModelsByBrandIdFromDB: ',error)
    } finally {
        if (connection) connection.release()
    }
}