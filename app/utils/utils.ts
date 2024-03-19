import { FastifyRequest } from "fastify"

export const validateAuthBody = (req: FastifyRequest) => {
    
    return { isValid: true, error: 'no error' }
}