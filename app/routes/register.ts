import { User } from 'app/types/types';
import { validateAuthBody } from 'app/utils/utils';
import { FastifyInstance } from 'fastify';

export default async function register (f: FastifyInstance) {
  f.post<{ Body: User }>('/register', async (req, res) => {

    const { isValid, error } = validateAuthBody(req)  
    
    if(!isValid) return { msg: 'You are not registered!', error }
    
    return { msg: 'You are registered!' };
  });
  
}