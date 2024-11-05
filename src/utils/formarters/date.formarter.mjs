function formatDate(isoDate) {
    const date = new Date(isoDate);
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    //const daysOfWeek = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    if (isNaN(date)) return 'Invalid Date';
    return `${daysOfWeek[date.getDay()]} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
}

function formatTime(isoDate) {
    const date = new Date(isoDate);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

export const date = (isoDate) =>{
    return {
        date: formatDate(isoDate),
        hour: formatTime(isoDate),
    }
}

export const dateFull = (isoDate) =>{
    return `${formatDate(isoDate)}, ${formatTime(isoDate)}hs`
}

export const dateString = (logHistory) => {
    let temp = []
    logHistory.forEach(isoDate => {
        temp.push(date(isoDate.ul_login))
    })
    return temp
}