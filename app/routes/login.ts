import { User } from 'app/types/types';
import { validateAuthBody } from '../utils/utils';
import { FastifyInstance } from 'fastify';
import { compare } from '@node-rs/bcrypt';
import { sign } from 'jsonwebtoken';

export default async function login (f: FastifyInstance) {
  f.post<{ Body: User }>('/login', async  (req, res) => {

    const error = validateAuthBody(req)
    let user = undefined;

    if(error) return res.code(403).send({ status: `${res.statusCode}`, msg: 'You are not logged in!', error })

    try {
      const users =  f.mongo.db?.collection('users')
      //filter to just return user and pwd from document
      user = await users?.findOne<User>({ email: req.body.email })
    } catch (e) {
      throw res.code(500).send({ status: `${res.statusCode}`, msg: `An error has occurred. ${e}` })
    }

    if(!user) {
      return res.code(404).send({ status: `${res.statusCode}`, msg: 'User or password are incorrect' })
    }

    const validPwd = await compare(req.body.pwd, user?.pwd)
    if(!validPwd) {
      return res.code(404).send({ status: `${res.statusCode}`, msg: 'User or password are incorrect' })
    }

    const token = sign({ email: user?.email, type: user?.type }, `${process.env.SECRET_KEY}`, {
      expiresIn: '30m',
    });

    return { message: 'Your are logged in!', token };
  });
}