import { pool } from "../config/connectionDB.mjs";

export const getUserAllFromDB = async () => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        BIN_TO_UUID(u.user_id) AS user_id,
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

export const getUserDB = async (uid) => {
    const connection = await pool.getConnection()
    const query = `
    SELECT
        BIN_TO_UUID(user_id) AS user_id,
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
        BIN_TO_UUID(user_id) = ?`

    try {
        const [[rows]] = await connection.query(query, uid)
        return rows
    } catch (error) {
        console.log('---[ERROR] model/getUserDB: ', error)
    } finally {
        if (connection) connection.release()
    }
}

export const insertUserDB = async (data) => {

    const connection = await pool.getConnection()

    try {
        //Iniciar transacción
        await connection.beginTransaction();

        //Inserta el usuario
        const queryUser = `
        INSERT INTO users
        (
            user_id,
            user_name,
            user_lastname,
            user_dni,
            user_email,
            user_password
        )
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?)`;

        const paramsUser = [
            data.user_id,
            data.user_name,
            data.user_lastname,
            data.user_dni,
            data.user_email,
            data.user_password];

        await connection.query(queryUser, paramsUser);

        //Asocia el rol del usuario
        const queryUhr = `
        INSERT INTO user_has_role
            (user_id, role_id)
        VALUES (UUID_TO_BIN(?), ?)`;

        const paramsUhr = [data.user_id, data.role_id];

        await connection.query(queryUhr, paramsUhr);
        //Finalizar transacción
        await connection.commit();

        return { status: true };
    } catch (error) {
        await connection.rollback();
        console.error('---[ERROR] model/insertUserInDB: ', error.message);
        return { status: false };
    } finally {
        // Liberar la conexión
        if (connection) connection.release();
    }
}


export const updateUserDB = async (uid,user) => {
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
                BIN_TO_UUID(user_id) = ?`

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
                BIN_TO_UUID(user_id) = ?`

        const paramsRole = [user.role_id, uid]

        await connection.query(queryUser, paramsUser)
        await connection.query(queryRole, paramsRole)

        //Finaliza transaccion
        await connection.commit()

        return ({ status: true })
    } catch (error) {
        await connection.rollback()
        console.error('---[ERROR] model/updateUserDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}

export const updateUserStatusDB = async (user) => {
    const connection = await pool.getConnection()

    const query = `UPDATE users SET user_status = ?, status_at = current_timestamp WHERE BIN_TO_UUID(user_id) = ?`

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

export const updatePasswordDB = async (user) => {
    const connection = await pool.getConnection()

    const query = `UPDATE users SET user_password = ? WHERE BIN_TO_UUID(user_id) = ?`

    const params = [user.password, user.id]

    try {
        await connection.query(query, params)
        return({status: true})
    } catch (error) {
        console.error('---[ERROR] model/updateUserPasswordDB: ', error.message);
        return ({ status: false })
    } finally {
        if (connection) { connection.release() }
    }
}