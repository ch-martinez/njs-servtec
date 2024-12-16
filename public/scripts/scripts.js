const m_reset_pwd = document.querySelector('#m_reset_pwd')
const m_status = document.querySelector('#m_status')

if (m_reset_pwd) {
    const data = {url: `/user/${m_reset_pwd.dataset.id}/pwd/reset`}
    m_reset_pwd.addEventListener('click', () => {
        alert_reset_pass(data)
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