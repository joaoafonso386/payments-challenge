import { User } from 'app/types/types';
import { FastifyRequest } from "fastify"

export const validateAuthBody = (req: FastifyRequest<{ Body: User }>) => {

    const { url, body } = req
    const { name, pwd, email, postCode, type } = body

    if(url === "/register") {
        const errorRes = `Must provide name, password, email, post code and type. Only provided ${JSON.stringify(body)}`
        if (!name || !pwd || !email || !postCode || !type) return errorRes
        return false
    }
    
    if(url === "/login") {
        if(!name || !pwd) return 'No user or password provided!'
        return false
    }
    
    
    return false
}

