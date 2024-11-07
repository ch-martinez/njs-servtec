import { dateFull } from "./date.formarter.mjs"

export const user = (user) => {
    console.log(user)
    return {
        id: user.user_id,
        name: user.user_name,
        lastname: user.user_lastname,
        dni: user.user_dni,
        email: user.user_email,
        created_at: dateFull(user.created_at),
        updated_at: dateFull(user.updated_at),

        status: user.user_status,
        deleted_at: dateFull(user.user_deleted_at),
    }
}