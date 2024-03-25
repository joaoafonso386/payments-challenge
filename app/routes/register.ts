import { User } from 'app/types/types';
import { hashPwd, validateAuthBody } from "../utils/utils";
import { FastifyInstance } from 'fastify';

export default async function register (f: FastifyInstance) {
  f.post<{ Body: User }>('/register', async (req, res) => {

    let inserted = undefined
    const { log }= req
    const error = validateAuthBody(req)
    
    if(error) return res.code(403).send({ status: `${res.statusCode}`, msg: 'You are not registered!', error })
   
    log.info("Hashing password...")
    const pwd = await hashPwd(req.body.pwd)
    log.info("Inserting in DB...")

    try {
      const users =  f.mongo.db?.collection('users')
      inserted = await users?.insertOne({ ...req.body, pwd })
      log.info("User inserted!")
    } catch(e) {
      throw res.code(500).send({ status: `${res.statusCode}`, msg: `An error has occorred. ${e}` })
    } 

     //return jwt

    return res.code(200).send({ status: `${res.statusCode}`, msg: "You are registered", inserted: inserted?.acknowledged })
  });
  
}