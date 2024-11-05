const m_rol = document.querySelector('#menu_rol')
const m_user_data = document.querySelector('#menu_user_data')
const m_password = document.querySelector('#menu_password')
const m_reset_pass = document.querySelector('#menu_reset_pass')
const m_disable_user = document.querySelector('#menu_disable_user')


if (m_rol) {
    m_rol.addEventListener('click', () => {
        alert_rol()
    })
}

if (m_user_data) {
    m_user_data.addEventListener('click', () => {
        alert_user_data()
    })
}

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

if (m_disable_user) {
    m_disable_user.addEventListener('click', () => {
        alert_disable_user()
    })
}