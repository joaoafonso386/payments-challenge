import { User } from 'app/types/types';
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: User }>('/login', async  (req, res) => {

    const { user, pass } = req.body 

    if(!user || !pass) throw new Error("Must provide credentials");

    return { message: 'Hello to login', user, pass };
  });
  
}