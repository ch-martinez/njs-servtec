export const pm = (pm) => {
    return {
        id: pm.pm_id,
        code: pm.pm_code,
        name: pm.pm_name
    }
}

export const pmList = (pml) => {
    let aux = []

    pml.forEach((pme) => {
        aux.push(pm(pme))
    });

    return aux
}