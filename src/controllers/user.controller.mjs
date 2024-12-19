import * as m_user from "../models/user.model.mjs";
import * as m_role from "../models/role.model.mjs"
import * as m_order from "../models/order.model.mjs"
import * as m_user_login from "../models/user_login.model.mjs"

import * as f_user from "../utils/formarters/user.formarter.mjs";
import * as f_date from "../utils/formarters/date.formarter.mjs";
import * as f_role from "../utils/formarters/role.formarter.mjs";
import * as f_order from "../utils/formarters/order.formarter.mjs";
import * as generate from "../utils/generate.mjs";

export const getAllUsers = async (req, res) => {

    const userList = await m_user.getUserAllFromDB()

    let data = {
        title: 'Usuarios',
        desc: 'Listado de todos los usuarios',
        nav: 'user',
        users: userList
    };
    res.render('pages/user/users', { layout: 'layouts/main_layout', data });
};

export const getNewUser = async (req, res) => {

    const roles = f_role.roles(await m_role.getAllRolesDB())

    let data = {
        title: 'Nuevo usuario',
        nav: 'user',
    };

    res.render('pages/user/user_new', { layout: 'layouts/main_layout', data, roles });
};

export const postNewUser = async (req, res) => {

    const user = f_user.postNewUser(req.body)
    const insertRes = await m_user.insertUserDB(user)

    if (insertRes.status) {
        res.send({
            status: true,
            msg: "Usuario creado con exito!",
            url: `/user/${insertRes.user_id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error al crear el usuario!"
        })
    }
};

export const getUser = async (req, res) => {

    const uid = req.params.id

    const user_data = f_user.user(await m_user.getUserDB(uid))
    const user_login = f_date.loginHistory(await m_user_login.getUserLoginDB(uid))
    const user_role = f_role.role(await m_role.getUserRoleDB(uid))
    // ************************************************** TERMINAR OREDENES DE USUARIO
    //const user_orders = f_order.list(await m_order.allUserOrdersDB(uid))
    const user_orders = []

    let data = {
        title: 'Detalle de usuario',
        nav: 'user',
    };

    const user = {
        ...user_data,
        role: user_role,
        login_history: user_login,
        orders: user_orders
    }

    res.render('pages/user/user_detail', { layout: 'layouts/main_layout', data, user });
};

export const getEditUser = async (req, res) => {
    const uid = req.params.id
    const roles = f_role.roles(await m_role.getAllRolesDB())
    const user_data = f_user.user(await m_user.getUserDB(uid))
    const user_role = f_role.role(await m_role.getUserRoleDB(uid))

    let data = {
        title: 'Editar usuario',
        nav: 'user',
    };

    const user = {
        ...user_data,
        role: user_role,
    }

    res.render('pages/user/user_edit', { layout: 'layouts/main_layout', data, user, roles });
};

export const putEditUser = async (req, res) => {
    const uid = req.params.id
    const user = req.body
    const updateRes = await m_user.updateUserDB(uid,user)

    if (updateRes.status) {
        res.send({
            status: true,
            msg: "Actualizado con exito!",
            url: `/user/${uid}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al actualizar los datos!"
        })
    }
};

export const postUserStatus = async (req, res) => {
    const user = {
        id: req.params.id,
        status: !(req.body.status == "true")
    }

    const updateRes = await m_user.updateUserStatusDB(user)

    if (updateRes.status) {
        res.send({
            status: true,
            msg: !(user.status) ? "Usuario deshabilitado!" : "Usuario habilitado!",
            url: `/user/${user.id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error en la operación!"
        })
    }
}

export const getUpdatePassword = async (req, res) => {

    const uid = req.params.id

    let data = {
        title: 'Cambiar contraseña',
        nav: 'user',
    };

    res.render('pages/user/user_password_update', { layout: 'layouts/main_layout', data, uid});
};

export const putUpdatePassword = async (req, res) => {

    const user = f_user.updatePwd(req.params.id, req.body)

    const updateRes = await m_user.updatePasswordDB(user)

    if (updateRes.status) {
        res.send({
            status: true,
            msg: "Actualizado con exito!",
            url: `/user/${user.id}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al actualizar los datos!"
        })
    }
};

export const postResetPassword = async (req, res) => {

    const pwd = {pwd: generate.randomPwd()}

    const user = f_user.updatePwd(req.params.id, pwd)

    const updateRes = await m_user.updatePasswordDB(user)

    if (updateRes.status) {
        res.send({
            status: true,
            msg: "Contraseña restablecida con exito!",
            url: `/user/${user.id}`
        })
    }else{
        res.send({
            status: false,
            msg: "Error al restablecer contraseña!"
        })
    }
};