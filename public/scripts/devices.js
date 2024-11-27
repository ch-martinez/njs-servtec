const db_select = document.querySelector('#devices_brands')
const dm_select = document.querySelector('#devices_models')
const dm_other = document.querySelector('#devices_other')

const loadOptions = (res) => {
    dm_select.options.length = 2;
    res.forEach(model => {
            let opcion = document.createElement('option')
            opcion.value = model.dm_id
            opcion.text = model.dm_model
            dm_select.add(opcion);

    });
}

db_select.addEventListener('change', (e) => {
    const db_id = e.target.value
    axios.get(`/device/api/get_models/${db_id}`)
         .then(function (response) {loadOptions(response.data)})
})


dm_select.addEventListener('change', (e) => {
    if (e.target.value == '1'){
        dm_other.removeAttribute("disabled");
    }else{
        dm_other.setAttribute("disabled", "");
        dm_other.value = null
    }
})


const prepaid = document.querySelector('#order_prepaid')

if (prepaid) {
    const pm = document.querySelector('#order_payment_method')
    prepaid.addEventListener('click', (e) => {
        e.target.checked ? pm.removeAttribute("disabled") : pm.setAttribute("disabled", "")
        pm.value = "none"
    })
}