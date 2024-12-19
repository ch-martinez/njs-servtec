export const paymentMethod = (pm) => {
    return {
        id: pm.pm_id,
        code: pm.pm_code,
        name: pm.pm_name
    }
}

export const paymentMethods = (pms) => {
    let arr = []

    pms.forEach((pm) => {
        arr.push(paymentMethod(pm))
    });

    return arr
}