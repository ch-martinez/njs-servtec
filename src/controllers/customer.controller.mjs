import * as customer_model from "../models/customer.model.mjs";
import * as customer_formarter from "../utils/formarters/customer.formarter.mjs";

export const customersView = async (req, res) => {

    const customers = customer_formarter.customersList(await customer_model.getAllCustomersFromDB())

    let data = {
        title: 'Clientes',
        nav: 'customer'
    };

    res.render('pages/customer/customers', { layout: 'layouts/main_layout', data, customers });
};

export const customerNewView = async (req, res) => {

    let data = {
        title: 'Nuevo Cliente',
        nav: 'customer'
    };
    res.render('pages/customer/customer_new', { layout: 'layouts/main_layout', data });
};

export const customerNew = async (req, res) => {

    const cust = customer_formarter.customerNewPost(req.body)
    const insertRes = await customer_model.insertCustomerInDB(cust)

    if (insertRes.status) {
        const responseData = {
            status: true,
            msg: "Cliente creado con exito!",
            url: `/customer/${insertRes.customer_id}`
        }
        res.send(responseData)
    } else {
        const responseData = {
            status: false,
            msg: "Error al crear el cliente!"
        }
        res.send(responseData)
    }

};

export const customerDetailView = async (req, res) => {

    const cid = req.params.id

    const customer_data = customer_formarter.customer(await customer_model.getCustomerByIdFromDB(cid))

    let data = {
        title: 'Detalle de cliente',
        nav: 'customer'
    };

    const cust = {
        ...customer_data
    }
    res.render('pages/customer/customer_detail', { layout: 'layouts/main_layout', data, cust });
};

export const customerEditView = async (req, res) => {

    const cid = req.params.id

    const customer = customer_formarter.customer(await customer_model.getCustomerByIdFromDB(cid))

    let data = {
        title: 'Editar datos de cliente',
        nav: 'customer'
    };

    res.render('pages/customer/customer_edit', { layout: 'layouts/main_layout', data, customer });
};

export const customerEditPut = async (req, res) => {
    const cid = req.params.id
    const customer = req.body

    const updateRes = await customer_model.updateCustomerInDB(cid, customer)

    if (updateRes.status){
        res.send({
            status: true,
            msg: "Actualizado con exito!",
            url: `/customer/${cid}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al actualizar los datos!"
        })
    }

}


export const statusCustomer = async (req, res) => {
    const customer = {
        id: req.params.id,
        status: !(req.body.status == "true")
    }

    const statusRes = await customer_model.statusCustomerInDB(customer)

    if (statusRes.status) {
        res.send({
            status: true,
            msg: !(customer.status) ? "Cliente deshabilitado!" : "Cliente habilitado!",
            url: `/customer/${customer.id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error en la operación!"
        })
    }
}