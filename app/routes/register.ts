import { User } from 'app/types/types';
import { hashPwd, validateAuthBody } from "../utils/utils";
import { FastifyInstance } from 'fastify';

export default async function register (f: FastifyInstance) {
  f.post<{ Body: User }>('/register', async (req, res) => {

    const error = validateAuthBody(req)

    if(error) return { msg: 'You are not registered!', error }

    const users =  f.mongo.db?.collection('users')
    const pwd = hashPwd(req.body.pwd)
    const inserted = await users?.insertOne(req.body)
    return { msg: 'You are registered!' };
    
  });
  
}