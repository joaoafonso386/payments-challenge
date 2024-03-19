import { User } from 'app/types/types';
import { FastifyInstance } from 'fastify';

export default async function (f: FastifyInstance) {
  f.post<{ Body: User }>('/login', async  (req, res) => {

    // const { name, pass } = req.body 

    // if(!name || !pass) throw new Error("Must provide credentials");

    return { message: 'Your are logged in!' };
  });
}