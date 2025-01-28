import { v1 } from "uuid";
import { lastTicketFromDB } from "../models/ticket_generator.model.mjs";

export const ticket = async (type) => {
    let tcid = type == "ORD" ? 1 : 2

    const res = await lastTicketFromDB(tcid)
    return `${type}0000${res}`
}

export const randomPwd = () => {
    const regex = /^(?=(.*[A-Za-z]){3})(?=(.*[0-9]){3})[A-Za-z0-9]{6}$/;
    let password = '';

    while (!regex.test(password)) {
        password = Array.from({ length: 6 }, () => {
            return String.fromCharCode(Math.floor(Math.random() * 62) + 48)
                .replace(/[^A-Za-z0-9]/g, '');
        }).join('');
    }

    return password;
}

export const uuid = () => v1()

export const timeStamp = () => {
    const timeStamp = new Date();
    return `${timeStamp.getFullYear()}-${String(timeStamp.getMonth() + 1).padStart(2, '0')}-${String(timeStamp.getDate()).padStart(2, '0')}-${String(timeStamp.getHours()).padStart(2, '0')}${String(timeStamp.getMinutes()).padStart(2, '0')}`;
}