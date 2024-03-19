import { User } from 'app/types/types';
import { FastifyInstance } from 'fastify';

export default async function (f: FastifyInstance) {
  f.post<{ Body: User }>('/login', async  (req, res) => {

    const { user, pass } = req.body 

    if(!user || !pass) throw new Error("Must provide credentials");

    return { message: 'Your are logged in!', user, pass };
  });

  f.get<{ Body: User }>('/register', async (req, res) => {

    const users: any = f.mongo?.db?.collection('users')
    const { name } = await users.findOne({ "name": "John Doe" })
    
    return { message: 'You are registered', name };
  });
  
}