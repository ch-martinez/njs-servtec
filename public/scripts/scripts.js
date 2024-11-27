const m_password = document.querySelector('#menu_password')
const m_reset_pass = document.querySelector('#menu_reset_pass')
const m_status = document.querySelector('#m_status')


if (m_password) {
    m_password.addEventListener('click', () => {
        alert_pass()
    })
}

if (m_reset_pass) {
    m_reset_pass.addEventListener('click', () => {
        alert_reset_pass()
    })
}

if (m_status) {
    const data = {
        id: m_status.dataset.id,
        status: m_status.dataset.status,
        msg: m_status.dataset.status == "true" ? "¿Está seguro que desea deshabilitarlo?" : "¿Está seguro que desea habilitarlo?",
        url: `/${m_status.dataset.type}/${m_status.dataset.id}/status`
    }

    m_status.addEventListener('click', async () => {
        swalChangeStatus(data)
    })
}