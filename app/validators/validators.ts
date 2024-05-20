import { User } from 'app/types/types';
import { FastifyRequest } from "fastify"
import * as EmailValidator from 'email-validator';


export const validateAuthBody = (req: FastifyRequest<{ Body: User }>) => {

    const { url } = req
    const { name, pwd, email, postCode, type } = req.body

    if(url === "/register") {
        const errorRes = `Must provide name, password, email, post code and type. Must have a valid postCode and email. Provided ${JSON.stringify(req.body)}`
        if (!name || !pwd || !email || !postCode || !type || !validatePostCode(postCode) || !validateEmail(email)) return errorRes
        return false
    }
    
    if(url === "/login") {
        if(!pwd || !email || !validateEmail(email)) return 'No email or password provided! Your email format can also be incorrect, please check it'
        return false
    }

}

//Validates PT post codes
export const validatePostCode = (postCode: string) => {
    return /^[1-9][0-9]{3}-[0-9]{3}$/.test(postCode) 
}

export const validateEmail = (email: string) => {
    return EmailValidator.validate(email)
}