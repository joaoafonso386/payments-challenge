import { User } from 'app/types/types';
import { FastifyRequest } from "fastify"

export const validateAuthBody = (req: FastifyRequest<{ Body: User }>) => {

    const { url, body } = req
    const { name, pass, email, postCode } = body

    if(url === "/register") {
        if (!name || !pass || !email || !postCode) return 'Must provide all arguments'
        return false
    }
    
    if(url === "/login") {
        if(!name || !pass) return 'No user or password provided!'
        return false
    }
    
    
    return false
}