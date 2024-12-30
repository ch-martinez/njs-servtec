export const role = (role) => {
    return {
        role_id: role.role_id,
        role_name: role.role_name,
        role_code: role.role_code
    }
}

export const roles = (roles) => {
    let arr = []
    roles.forEach((r) => {
        arr.push(role(r))
    })
    return arr
}