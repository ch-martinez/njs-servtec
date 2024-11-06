import * as customer_model from "../models/customer.model.mjs";
import * as customer_formarter from "../utils/formarters/customer.formarter.mjs";

export const customersView = async (req, res) => {

    const customers = customer_formarter.customerListFormarter(await customer_model.getAllCustomersFromDB())

    let data = {
        title: 'Clientes',
        nav: 'customer'
    };

    res.render('pages/customer/customers_page', { layout: 'layouts/main_layout', data, customers });
};

export const customerNewView = async (req, res) => {

    let data = {
        title: 'Nuevo Cliente',
        nav: 'customer'
    };
    res.render('pages/customer/customer_new_page', { layout: 'layouts/main_layout', data });
};

export const customerDetailView = async (req, res) => {

    const cid = req.params.id

    const customer_data = customer_formarter.customerFormarter(await customer_model.getCustomerByIdFromDB(cid))

    let data = {
        title: 'Detalle de cliente',
        nav: 'customer'
    };

    const cust = {
        ...customer_data
    }
    res.render('pages/customer/customer_detail', { layout: 'layouts/main_layout', data, cust });
};