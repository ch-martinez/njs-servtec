/* Lee el formulario y sus datos */
const form = document.querySelector('#form')

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
