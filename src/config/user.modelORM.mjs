import { DataTypes } from 'sequelize'
import { db } from '../config/connectionDB.mjs'

const user = db.define('users',{
    name: {type: DataTypes.STRING},
    lastname: {type: DataTypes.STRING},
    dni: {type: DataTypes.INTEGER},
    email: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING}
},{
    createdAt: "created_at",
    updatedAt: "updated_at",
})

export default user