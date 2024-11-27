import { dateFull } from "./date.formarter.mjs"

export const user = (user) => {
    return {
        id: user.user_id,
        name: user.user_name,
        lastname: user.user_lastname,
        dni: user.user_dni,
        email: user.user_email,
        created_at: dateFull(user.created_at),
        updated_at: dateFull(user.updated_at),

        status: (user.user_status == 1),
        status_at: dateFull(user.user_status_at),
    }
}

export const userNewPost = (user) => {
    return {
        user_id: user.user_id,
        user_name: user.user_name,
        user_lastname: user.user_lastname,
        user_dni: user.user_dni,
        user_email: (user.user_email).toLowerCase(),

        role_id: user.role_id
    }
}