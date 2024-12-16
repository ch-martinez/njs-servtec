import { pool } from "../config/connectionDB.mjs";

export const lastTicketFromDB = async (id) => {
    const connection = await pool.getConnection()

    const query = `SELECT tc_num FROM ticket_controller WHERE tc_id = ?`
    const queryUpdate = "UPDATE ticket_controller SET tc_num = ? + 1 WHERE tc_id = ?"

    try {
        //Iniciar transacción
        await connection.beginTransaction()

        let [[res]] = await connection.query(query, id)
        console.log(res)
        let plas = Number(res)
        await connection.query(queryUpdate, [res.tc_num, id])

        //Finalizar transacción
        await connection.commit()

        console.log("NUMERO: ",res.tc_num)

        return res.tc_num
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/getLastTicketFromDB: ', error.message)
        return { status: false }
    } finally {
        if (connection) connection.release()
    }
}