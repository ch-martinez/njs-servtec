import { Sequelize } from 'sequelize'

export const db = new Sequelize('servtec', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
})



/* const testConnection = async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection() */