/* Lee el formulario y sus datos */
const form = document.querySelector('#form')
const form_multi = document.querySelector('#form_multi')

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const url = form.action
        const formData = new FormData(form)
        let data = {}

        formData.forEach((value, key) => { data[key] = value })

        axios.post(url, data)
             .then(res => {res.data.status ? swal_succes(res.data) : swal_error(res.data)})
    })
}

if (form_multi) {
    form_multi.addEventListener('submit', (e) => {
        e.preventDefault()
        const url = form_multi.action
        const formData = new FormData(form_multi)
        let data = {}

        formData.forEach((value, key) => { data[key] = value })

        axios.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' }})
             .then(res => {res.data.status ? swal_succes(res.data) : swal_error(res.data)})
    })
}