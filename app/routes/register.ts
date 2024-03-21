import { User } from 'app/types/types';
import { validateAuthBody } from "../utils/utils";
import { FastifyInstance } from 'fastify';

export default async function register (f: FastifyInstance) {
  f.post<{ Body: User }>('/register', async (req, res) => {

    const error = validateAuthBody(req)

    if(!error) return { msg: 'You are registered!' };
    
    return { msg: 'You are not registered!', error }
    
  });
  
}