import { User } from 'app/types/types';
import { FastifyRequest } from "fastify"

export const validateAuthBody = (req: FastifyRequest<{ Body: User }>) => {

    const { url, body } = req
    const { name, pass } = body

    if(url === "/register") {
        if(!name || !pass)
        return { isValid: true, error: 'no error' }
    }
    
    if(url === "/login") {
        return { isValid: true, error: 'no error' }
    }
    
    
    return { isValid: true, error: 'no error' }
}