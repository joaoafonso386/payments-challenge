import { User } from 'app/types/types';
import { FastifyRequest } from "fastify"

export const validateAuthBody = (req: FastifyRequest<{ Body: User }>) => {

    const { url, body } = req
    const { name, pass, email, postCode } = body

    if(url === "/register") {
        const errorRes = `Must provide name, password, email and post code, only provided ${JSON.stringify(body)}`
        if (!name || !pass || !email || !postCode) return errorRes
        return false
    }
    
    if(url === "/login") {
        if(!name || !pass) return 'No user or password provided!'
        return false
    }
    
    
    return false
}