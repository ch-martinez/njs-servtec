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
        u.status_at,
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
        console.error('---[ERROR] model/getUserAll: ', error.message)
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
        status_at
    FROM
        users u
    WHERE
        user_id = ?`

    try {
        const [[rows]] = await connection.query(query, uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getUserAll: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const insertUserInDB = async (data) => {

    const connection = await pool.getConnection()

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        //Inserta el usuario
        const queryUser = `
        INSERT INTO users
        (
            user_name,
            user_lastname,
            user_dni,
            user_email,
            user_password
        )
        VALUES (?, ?, ?, ?, ?)`;

        const paramsUser = [
            data.user_name,
            data.user_lastname,
            data.user_dni,
            data.user_email,
            data.user_password];

        const [insertUserResult] = await connection.query(queryUser, paramsUser);

        //Obtener el id del producto
        const uid = insertUserResult.insertId;

        //Asocia el rol del usuario
        const queryUhr = `
        INSERT INTO user_has_role
            (user_id, role_id)
        VALUES (?, ?)`;

        const paramsUhr = [uid, data.role_id];

        await connection.query(queryUhr, paramsUhr);
        //Finalizar transacción
        await connection.commit();

        return { status: true, user_id: uid };
    } catch (error) {
        await connection.rollback();
        console.error('---[ERROR] model/insertUserInDB: ', error.message);
        return { status: false };
    } finally {
        // Liberar la conexión
        if (connection) connection.release();
    }
}


export const updateUserInDB = async (uid,user) => {
    const connection = await pool.getConnection()

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        const queryUser = `
            UPDATE users
            SET
                user_name = ?,
                user_lastname = ?,
                user_dni = ?,
                user_email = ?
            WHERE
                user_id = ?`

        const paramsUser = [
            user.user_name,
            user.user_lastname,
            user.user_dni,
            user.user_email,
            uid]

        const queryRole = `
            UPDATE user_has_role
            SET
                role_id = ?
            WHERE
                user_id = ?`

        const paramsRole = [user.role_id, uid]

        await connection.query(queryUser, paramsUser)
        await connection.query(queryRole, paramsRole)

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/updateUserInDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}

export const statusUserInDB = async (user) => {
    const connection = await pool.getConnection()

    const query = `UPDATE users SET user_status = ?, status_at = current_timestamp WHERE user_id = ?`

    const params = [user.status, user.id]

    try {
        await connection.query(query, params)
        return({status: true})
    } catch (error) {
        console.error('---[ERROR] model/statusUserInDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}