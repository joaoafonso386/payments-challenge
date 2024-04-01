import { User } from 'app/types/types';
import { validateAuthBody } from 'app/utils/utils';
import { FastifyInstance } from 'fastify';

export default async function (f: FastifyInstance) {
  f.post<{ Body: User }>('/login', async  (req, res) => {

    const error = validateAuthBody(req)

    if(error) return res.code(403).send({ status: `${res.statusCode}`, msg: 'You are not logged in!', error })

    return { message: 'Your are logged in!' };
  });
}