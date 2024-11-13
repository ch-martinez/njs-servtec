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
         .then(function (response) {
             console.log(response.data);
             loadOptions(response.data)
         })
})


dm_select.addEventListener('change', (e) => {
    if (e.target.value == '13646'){
        dm_other.removeAttribute("disabled");
    }else{
        dm_other.setAttribute("disabled", "");
        dm_other.value = ''
    }
})