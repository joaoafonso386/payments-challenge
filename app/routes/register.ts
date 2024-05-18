import { User } from 'app/types/types';
import { hash } from '@node-rs/bcrypt';
import { validateAuthBody } from "../utils/utils";
import { FastifyInstance } from 'fastify';

export default async function register (f: FastifyInstance) {
  f.post<{ Body: User }>('/register', async (req, res) => {

    let inserted;
    const error = validateAuthBody(req)

    if(error) return res.code(403).send({ status: `${res.statusCode}`, msg: 'You are not registered!', error })
   
    const hasedPwd = await hash(req.body.pwd)
    const balance = Math.round(Math.random() * 10000)

    try {
      const users =  f.mongo.client.db().collection('users')
      inserted = await users?.findOneAndUpdate({ ...req.body, pwd: hasedPwd, balance }, { $set: {} }, { upsert: true, returnDocument: "after" })
      req.log.info("User inserted!")
    } catch(e) {
      throw res.code(500).send({ status: `${res.statusCode}`, msg: `An error has occurred. ${e}` })
    } 


    return res.code(200).send({ status: `${res.statusCode}`, msg: "You are registered!" })
  });
  
}