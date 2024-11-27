import * as user_model from "../models/user.model.mjs";
import * as role_model from "../models/role.model.mjs"
import * as user_login_model from "../models/user_login.model.mjs"

import * as user_formarter from "../utils/formarters/user.formarter.mjs";
import * as date_formarter from "../utils/formarters/date.formarter.mjs";
import * as role_formarter from "../utils/formarters/role.formarter.mjs";

export const userAllView = async (req, res) => {

    const userList = await user_model.getUserAllFromDB()

    let data = {
        title: 'Usuarios',
        desc: 'Listado de todos los usuarios',
        nav: 'user',
        users: userList
    };
    res.render('pages/user/users', { layout: 'layouts/main_layout', data });
};

export const userView = async (req, res) => {

    const uid = req.params.id

    const user_data = user_formarter.user(await user_model.getUserByIdFromDB(uid))
    const user_login_history = date_formarter.loginHistory(await user_login_model.getUserLoginByIdFromDB(uid))
    const user_role = role_formarter.role(await role_model.getRoleByUserIdFromDB(uid))


    let data = {
        title: 'Detalle de usuario',
        nav: 'user',
    };

    const user = {
        ...user_data,
        role: user_role,
        login_history: user_login_history
    }

    res.render('pages/user/user_detail', { layout: 'layouts/main_layout', data, user });
};

export const userEditView = async (req, res) => {
    const uid = req.params.id
    const roles = role_formarter.rolesList(await role_model.getAllRolesFromDB())
    const user_data = user_formarter.user(await user_model.getUserByIdFromDB(uid))
    const user_role = role_formarter.role(await role_model.getRoleByUserIdFromDB(uid))

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

export const userEditPut = async (req, res) => {
    const uid = req.params.id
    const user = req.body
    const updateRes = await user_model.updateUserInDB(uid,user)

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

export const userNewView = async (req, res) => {

    const roles = role_formarter.rolesList(await role_model.getAllRolesFromDB())

    let data = {
        title: 'Nuevo usuario',
        nav: 'user',
    };

    res.render('pages/user/user_new', { layout: 'layouts/main_layout', data, roles });
};

export const userNew = async (req, res) => {

    const user = user_formarter.userNewPost(req.body)
    const insertResponse = await user_model.insertUserInDB(user)

    if (insertResponse.status) {
        res.send({
            status: true,
            msg: "Usuario creado con exito!",
            url: `/user/${insertResponse.user_id}`
        })

    } else {
        res.send({
            status: false,
            msg: "Error al crear el usuario!"
        })
    }
};

export const statusUser = async (req, res) => {
    const user = {
        id: req.params.id,
        status: !(req.body.status == "true")
    }

    const statusRes = await user_model.statusUserInDB(user)

    if (statusRes.status) {
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