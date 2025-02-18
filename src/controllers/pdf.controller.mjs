import * as generator from "../utils/pdf/pdf_generator.mjs";
import * as m_order from "../models/order.model.mjs"
import * as m_customer from "../models/customer.model.mjs"
import * as m_status from "../models/status.model.mjs"
import * as f_order from "../utils/formarters/order.formarter.mjs"
import * as f_customer from "../utils/formarters/customer.formarter.mjs"
import * as f_status from "../utils/formarters/status.formarter.mjs"


export const detailToPdf = async (req, res) => {
    const oid = req.params.oid
    const order = f_order.order(await m_order.getOrderDB(oid))
    const customer = f_customer.customer(await m_customer.getCustomerDB(order.customer_id))
    const lastStatus = f_status.lastStatus(await m_status.getLastStatusDB(oid))

    const data = {
        order: order,
        customer: customer,
        lastStatus: lastStatus
    }
    console.log(data)
/* 
    const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Orden.pdf`,
      }); */
    
    const PDF = await generator.detailToPdf(data);
    res.contentType("application/pdf");
    res.status(200).send(PDF);
}