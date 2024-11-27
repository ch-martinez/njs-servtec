export const role = (role) => {
    return {
        id: role.role_id,
        name: role.role_name,
        code: role.role_code
    }
}

export const rolesList = (role_list) => {
    let temp = []
    role_list.forEach((roler) => {
        temp.push(role(roler))
    })
    return temp
}