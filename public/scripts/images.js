const input = document.querySelector('#images')

if (input) {
    input.addEventListener('change', (e) => {
        const files = e.target.files

        if (files) {
            const ul = document.querySelector('.fu__ul')
            ul.innerHTML = ''

            Array.from(files).forEach(file => {
                const li = document.createElement('li')
                li.classList.add('fu__li')

                const img = document.createElement('img')
                img.classList.add('fu__img')

                img.src = URL.createObjectURL(file)

                li.appendChild(img)
                ul.appendChild(li)
            });

        } else {

        }
    })
}