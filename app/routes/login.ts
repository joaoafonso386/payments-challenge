import { User } from 'app/types/types';
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: User }>('/login', async  (req, res) => {

    const { user, pass } = req.body 

    if(!user || !pass) throw new Error("Must provide credentials");

    return { message: 'Your are logged in!', user, pass };
  });

  fastify.post<{ Body: User }>('/register', async  (req, res) => {

    const users = this.mongo.db.collection('users')
    const { name } = await users.findOne({ "name": "João Afonso" })

    return { message: 'You are registered' };
  });
  
}