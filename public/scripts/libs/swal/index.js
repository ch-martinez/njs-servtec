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

const alert_reset_pass = async (data) => {
    Swal.fire({
        ...swal_config,
        confirmButtonText: 'Enviar',
        html: `<section class="swal__section">
    <h3 class="swal__title">Restablecer contraseña</h3>
    <p class="swal__desc">Se enviara un mensaje al correo del usuario con los pasos a seguir para cambiar contraseña.</p>
</section>`,

    }).then((result) => {
        if (result.isConfirmed) {
            axios.post(data.url)
            .then(res => {res.data.status ? swal_succes(res.data) : swal_error(res.data)})
        }
      })
}
const swalChangeStatus = async (data) => {
    Swal.fire({
        ...swal_config,
        reverseButtons: false,
        html: `
        <section class="swal__section">
        <h3 class="swal__title">${data.msg}</h3>
        </section>`,

    }).then((result) => {
        if (result.isConfirmed) {
            axios.post(data.url, {id: data.id, status: data.status})
            .then(res => {res.data.status ? swal_succes(res.data) : swal_error(res.data)})
        }
      })
}

const alert_delet_order = async (id) => {
    Swal.fire({
        ...swal_config,
        reverseButtons: false,
        html: `
        <section class="swal__section">
        <h3 class="swal__title">¿Está seguro que desea eliminar la orden?</h3>
        </section>`,

    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`/order/${id}`)
            .then(res => {res.data.status ? swal_succes(res.data) : swal_error(res.data)})
        }
      })
}

/* ********************************************************************************** */

const swal_succes = async (data) => {
    Swal.fire({
        ...swal_config,
        icon: "success",
        title: `${data.msg}`,
        timer: 3000,
        showCancelButton: false,
        showConfirmButton: false,
    }).then(() => {
        window.location.href = `${data.url}`;
      });
}

const swal_error = async (data) => {
    Swal.fire({
        ...swal_config,
        icon: "error",
        title: `${data.msg}`,
        timer: 3000,
        showCancelButton: false,
        showConfirmButton: false,
    });
}