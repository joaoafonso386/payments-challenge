import { User } from 'app/types/types';
import { hashPwd, validateAuthBody } from "../utils/utils";
import { FastifyInstance } from 'fastify';
import { sign } from 'jsonwebtoken';

export default async function register (f: FastifyInstance) {
  f.post<{ Body: User }>('/register', async (req, res) => {

    let inserted = undefined
    const error = validateAuthBody(req)

    if(error) return res.code(403).send({ status: `${res.statusCode}`, msg: 'You are not registered!', error })
   
    req.log.info("Hashing password...")
    const hasedPwd = await hashPwd(req.body.pwd)
    req.log.info("Inserting in DB...")

    try {
      const users =  f.mongo.db?.collection('users')
      inserted = await users?.findOneAndUpdate({ ...req.body, pwd: hasedPwd }, { $set: {} }, { upsert: true, returnDocument: "after" })
      req.log.info("User inserted!")
    } catch(e) {
      throw res.code(500).send({ status: `${res.statusCode}`, msg: `An error has occurred. ${e}` })
    } 

    const token = sign({ role: inserted?.type }, `${process.env.SECRET_KEY}`, {
      expiresIn: '30m',
    });


    return res.code(200).send({ status: `${res.statusCode}`, msg: "You are registered", token })
  });
  
}