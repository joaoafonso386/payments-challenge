import { hash } from '@node-rs/bcrypt';
import { User } from 'app/types/types';
import { FastifyRequest } from "fastify"
import * as EmailValidator from 'email-validator';


export const validateAuthBody = (req: FastifyRequest<{ Body: User }>) => {

    const { url, body } = req
    const { name, pwd, email, postCode, type } = body

    //TODO: check if email is valid
    if(url === "/register") {
        const errorRes = `Must provide name, password, email, post code and type. Must have a valid postCode and email. Provided ${JSON.stringify(body)}`
        if (!name || !pwd || !email || !postCode || !type || !validatePostCode(postCode) || !validateEmail(email)) return errorRes
        return false
    }
    
    if(url === "/login") {
        if(!name || !pwd) return 'No user or password provided!'
        return false
    }
    
    
    return false
}

export const hashPwd = async (pwd: string) => {
    return await hash(pwd)
}

export const validatePostCode = (postCode: string) => {
    return /^[1-9][0-9]{3}-[0-9]{3}$/.test(postCode) 
}

export const validateEmail = (email: string) => {
    return EmailValidator.validate(email)
}
