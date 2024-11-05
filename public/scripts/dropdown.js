const pu = document.querySelector('#pu')

if (pu) {
    const dd_pu = document.querySelector('#dd-pu')
    pu.addEventListener('click', () => {
        dd_pu.classList.toggle('dd--hide');
        console.log("hola")
    })
}