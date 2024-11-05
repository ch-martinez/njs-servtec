// Clases de Swal
const swal_config = {
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: "Cancelar",
    customClass: {
        popup: 'sa-container',
        title: 'sa-title',
        htmlContainer: 'sa-html-container',
        confirmButton: 'btn sa-btn',
        cancelButton: 'btn sa-btn btn--gray',
        denyButton: 'btn sa-btn btn--gray',
    },
    showClass: {
        popup: `
          animate__animated
          animate__fadeIn
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOut
          animate__faster
        `
      },
}

const alert_rol = async () => {
    Swal.fire({
        ...swal_config,
        html: `<section class="swal__section">
    <h3 class="swal__title">Seleccione el nuevo rol</h3>
    <ul class="swal__ul">
        <li class="swal__li">
            <label class="label--checkbox" for="rol_adm">
                <input class="input--radio" type="radio" name="rol" id="rol_adm">
                Administrador
            </label>
        </li>
        <li class="swal__li">
            <label class="label--checkbox" for="rol_atc">
                <input class="input--radio" type="radio" name="rol" id="rol_atc">
                Atencion al cliente
            </label>
        </li>
        <li class="swal__li">
            <label class="label--checkbox" for="rol_tec">
                <input class="input--radio" type="radio" name="rol" id="rol_tec">
                Tecnico
            </label>
        </li>
    </ul>
</section>`,

    })
}

const alert_user_data = async () => {
    Swal.fire({
        ...swal_config,
        html: `<section class="swal__section">
    <h3 class="swal__title">Modificar datos</h3>
    <div class="item">
        <label class="label" for="user_name">Nombre</label>
        <input class="input-text" type="text" name="user_name" id="user_name">
    </div>
    <div class="item">
        <label class="label" for="user_lastname">Apellido</label>
        <input class="input-text" type="text" name="user_lastname" id="user_lastname">
    </div>
    <div class="item">
        <label class="label" for="user_dni">DNI</label>
        <input class="input-text" type="text" name="user_dni" id="user_dni">
    </div>
    <div class="item">
        <label class="label" for="user_email">Correo</label>
        <input class="input-text" type="text" name="user_email" id="user_email">
    </div>
</section>`,

    })
}
const alert_pass = async () => {
    Swal.fire({
        ...swal_config,
        html: `<section class="swal__section">
    <h3 class="swal__title">Cambiar contraseña</h3>
    <div class="item">
        <label for="user_pass" class="label">Nueva contraseña</label>
        <input class="input-text" type="text" name="user_pass" id="user_pass">
    </div>
    <div class="item">
        <label for="user_pass_repeat" class="label">Repetir contraseña</label>
        <input class="input-text" type="text" name="user_pass_repeat" id="user_pass_repeat">
    </div>
</section>`,

    })
}
const alert_reset_pass = async () => {
    Swal.fire({
        ...swal_config,
        confirmButtonText: 'Enviar',
        html: `<section class="swal__section">
    <h3 class="swal__title">Restablecer contraseña</h3>
    <p class="swal__desc">Se enviara un mensaje al correo del usuario con los pasos a seguir para cambiar contraseña.</p>
</section>`,

    })
}
const alert_disable_user = async () => {
    Swal.fire({
        ...swal_config,
        reverseButtons: false,
        html: `<section class="swal__section">
    <h3 class="swal__title">¿Está seguro que desea deshabilitar el usuario?</h3>
</section>`,

    })
}