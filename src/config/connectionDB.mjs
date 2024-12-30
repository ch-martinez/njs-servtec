import { createPool } from "mysql2/promise"
import { config } from "dotenv"
config()

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'servtec',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    charset: 'utf8mb4'  // Establecer el collation global
})

// Prueba que la conexion a la DB sea correcta
pool.getConnection()
    .then(connection => {
        console.log('>>> DB: Conexion OK')
        connection.release()
    })
    .catch(err => {
        console.log(`>>> DB: Error al obtener la conexion, ${err}`)
    })