export const roleFormarter = (role) => {
    return {
        id: role.role_id,
        name: role.role_name,
        code: role.role_code
    }
}

export const roleListFormarter = (role_list) => {
    let temp = []
    role_list.forEach((role) => {
        temp.push(roleFormarter(role))
    })
    return temp
}