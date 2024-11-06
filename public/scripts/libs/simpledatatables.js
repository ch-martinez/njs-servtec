const table_config = {
	locale: 'es-ES',
    searchable: true,
	fixedHeight: true,
    perPage: 10,

    labels: {
        placeholder: "Buscar...",
        searchTitle: "Buscar por Nombre, Marca, Precio, etc",
        pageTitle: "Pagina {page}",
        perPage: "registros por página",
        noRows: "Sin registros",
        info: "{rows} registos en total",
        noResults: "No hay resultados para tu busqueda",
    },
    classes: {
        input: "datatable-input input-text",
        selector: "datatable-selector input-select",
        paginationList: "datatable-pagination-list sdt-pagination-list",
        active: "datatable-active sdt-active",
    },
    columns: [
        // Sort the second column in ascending order
        //{ select: [0,7], sortable: false },
/*         {
            select: 6,
            filter: ["ACTIVO", "INACTIVO"],
        }, */
    ],
}

const table_login_history_config = {
    locale: 'es-ES',
    searchable: false,
	fixedHeight: true,
    perPage: 5,

    labels: {
        pageTitle: "Pagina {page}",
        perPage: "registros por página",
        noRows: "Sin registros",
        info: "{rows} registos en total",
    },
    classes: {
        input: "datatable-input input-text",
        selector: "datatable-selector input-select",
        paginationList: "datatable-pagination-list sdt-pagination-list",
        active: "datatable-active sdt-active",
    }
}


const dataTable = new simpleDatatables.DataTable("#table-main", table_config)
const dataTable2 = new simpleDatatables.DataTable("#table-loggin", table_login_history_config)