import * as m_customer from "../models/customer.model.mjs";
import * as m_order from "../models/order.model.mjs";
import * as f_customer from "../utils/formarters/customer.formarter.mjs";
import * as f_order from "../utils/formarters/order.formarter.mjs";
import * as generate from "../utils/generate.mjs"

const uid_tec = process.env.UUID_TEC1
const uid_atc = process.env.UUID_ATC1

export const getAllCustomers = async (req, res) => {

    const customers = f_customer.customers(await m_customer.getAllCustomersDB())

    let data = {
        title: 'Clientes',
        nav: 'customer'
    };

    res.render('pages/customer/customers', { layout: 'layouts/main_layout', data, customers });
};

export const getNewCustomer = async (req, res) => {

    let data = {
        title: 'Nuevo Cliente',
        nav: 'customer'
    };
    res.render('pages/customer/customer_new', { layout: 'layouts/main_layout', data });
};

export const postNewCustomer = async (req, res) => {
    const cid = await generate.uuid()
    const uid = uid_atc
    const insertRes = await m_customer.insertCustomerDB(f_customer.postNewCustomer(cid, uid, req.body))

    if (insertRes.status) {
        const responseData = {
            status: true,
            msg: "Cliente creado con exito!",
            url: `/customer/${cid}`
        }
        res.send(responseData)
    } else {
        let msg = insertRes.error == 1062 ? "Ya existe un cliente con este DNI" : "Error al crear el cliente!"
        const responseData = {
            status: false,
            msg: msg
        }
        res.send(responseData)
    }

};

export const getCustomer = async (req, res) => {
    const cid = req.params.id

    const customer_data = f_customer.customer(await m_customer.getCustomerDB(cid))
    const customer_orders = f_order.orders(await m_order.getAllCustomerOrdersDB(cid))

    let data = {
        title: 'Detalle de cliente',
        nav: 'customer'
    };

    const cust = {
        ...customer_data
    }
    res.render('pages/customer/customer_detail', { layout: 'layouts/main_layout', data, cust, customer_orders });
};

export const getEditCustomer = async (req, res) => {

    const cid = req.params.id

    const customer = f_customer.customer(await m_customer.getCustomerDB(cid))

    let data = {
        title: 'Editar datos de cliente',
        nav: 'customer'
    };

    res.render('pages/customer/customer_edit', { layout: 'layouts/main_layout', data, customer });
};

export const putEditCustomer = async (req, res) => {
    const customer = f_customer.putEditCustomer(req.params.id, req.body)
    const updateRes = await m_customer.updateCustomerDB(customer)

    if (updateRes.status){
        res.send({
            status: true,
            msg: "Actualizado con exito!",
            url: `/customer/${customer.id}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al actualizar los datos!"
        })
    }

}


export const postCustomerStatus = async (req, res) => {
    const customer = {
        id: req.params.id,
        status: !(req.body.status == "true")
    }

    const statusRes = await m_customer.updateCustomerStatusDB(customer)

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