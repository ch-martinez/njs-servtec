import { pool } from "../config/connectionDB.mjs";

function strToNum(input) { return input.split(',').map(Number) }

export const getStatusHistoryDB = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            BIN_TO_UUID(osh.order_id) AS order_id,
            BIN_TO_UUID(osh.created_by) AS created_by,
            osh.created_at,
            osh.osh_current,
            osc.osc_category,
            osc.osc_detail,
            osc.osc_type,
            u.user_name,
            u.user_lastname
        FROM
            order_status_history osh
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        INNER JOIN
            users u ON osh.created_by = u.user_id
        WHERE
            BIN_TO_UUID(osh.order_id) = ?
        ORDER BY osh.created_at DESC`

        const [result] = await connection.query(query, oid)
        return (result)
    } catch (error) {
        console.error('---[ERROR] model/getStatusLogDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const getLastStatusDB = async (oid) => {
    const connection = await pool.getConnection()
    try {
        const query = `
        SELECT
            BIN_TO_UUID(osh.order_id) AS order_id,
            BIN_TO_UUID(osh.created_by) AS created_by,
            osh.created_at,
            osh.osh_current,
            osh.osc_id,
            osc.osc_category,
            osc.osc_detail,
            osc.osc_type,
            osc.osc_next_status
        FROM
            order_status_history osh
        INNER JOIN
            order_status_code osc ON osh.osc_id = osc.osc_id
        WHERE
            BIN_TO_UUID(osh.order_id) = ? AND osh.osh_current = 1
        `


        const [[result]] = await connection.query(query, oid)

        const str = (strToNum(result.osc_next_status))
        const query2 = `SELECT * FROM order_status_code WHERE osc_id IN (${str})`
        const [result2] = await connection.query(query2, str)


        return ({ actual_status: result, next_status: result2 })
    } catch (error) {
        console.error('---[ERROR] model/getLastStatus: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}

export const insertNextStatusDB = async (status, data) => {
    const next_status = status.next_status

    //Actualiza el estado actual de la orden
    const queryUpdate = "UPDATE order_status_history SET osh_current = 0 WHERE BIN_TO_UUID(order_id) = ? AND osh_current = 1;"

    //Inserta el nuevo estado de la orden
    const queryInsert = `INSERT INTO order_status_history (order_id, osc_id, created_by) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?))`
    const paramsInsert = [status.order_id, status.next_status, status.user_id]

    const connection = await pool.getConnection()
    try {
        //Iniciar transacción
        await connection.beginTransaction()

        await connection.query(queryUpdate, status.order_id)
        await connection.query(queryInsert, paramsInsert)

        // Actualiza el presupuesto y el detalle del presupuesto
        if (next_status == 300) {
            await connection.query(
                "UPDATE orders SET order_budget = ?, order_budget_detail = ? WHERE BIN_TO_UUID(order_id) = ?",
                [data.budget.budget, data.budget.detail, status.order_id]
            )
        }

        // Reparado
        if (next_status == 450) {
            await connection.query("UPDATE orders SET order_repaired = 1 WHERE BIN_TO_UUID(order_id) = ?", status.order_id)
        }

        // Reparado parcial
        if (next_status == 460) {
            await connection.query("UPDATE orders SET order_repaired = 1 WHERE BIN_TO_UUID(order_id) = ?", status.order_id)
            await connection.query("UPDATE orders SET order_comment_tec = ? WHERE BIN_TO_UUID(order_id) = ?", [data.comment.comment, status.order_id])
        }

        // No reparado
        if (next_status == 220 || next_status == 470) {
            await connection.query("UPDATE orders SET order_repaired = 0 WHERE BIN_TO_UUID(order_id) = ?", status.order_id)
            await connection.query("UPDATE orders SET order_comment_tec = ? WHERE BIN_TO_UUID(order_id) = ?", [data.comment.comment, status.order_id])
        }

        // Orden finalizada
        if (next_status == 700 || next_status == 730) {
            await connection.query("UPDATE orders SET order_finished = 1 WHERE BIN_TO_UUID(order_id) = ?", status.order_id)
        }

        //Finaliza transaccion
        await connection.commit()
        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/insertNextStatusDB: ', error);
        return ({ status: false })
    } finally {
        if (connection) connection.release()
    }
}