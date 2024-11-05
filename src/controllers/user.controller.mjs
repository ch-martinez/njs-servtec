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
    res.render('pages/user/user_all_page', { layout: 'layouts/main_layout', data });
};

export const userView = async (req, res) => {

    const uid = req.params.id

    const user_data = user_formarter.userFormarter(await user_model.getUserByIdFromDB(uid))
    const user_login = date_formarter.dateString(await user_login_model.getUserLoginByIdFromDB(uid))
    const user_role = role_formarter.roleFormarter(await role_model.getRoleByUserIdFromDB(uid))


    let data = {
        title: 'Detalle de usuario',
        desc: `Informacion completa del usuario ${user_data.name}`,
        nav: 'user',
    };

    const user = {
        ...user_data,
        role: user_role,
        login: user_login
    }
    console.log(user)
    res.render('pages/user/user_page', { layout: 'layouts/main_layout', data, user });
};

export const userNewView = async (req, res) => {

    const roles = role_formarter.roleListFormarter(await role_model.getAllRolesFromDB())

    let data = {
        title: 'Nuevo usuario',
        desc: `Complete los datos`,
        nav: 'user',
    };

    res.render('pages/user/user_new', { layout: 'layouts/main_layout', data, roles });
};