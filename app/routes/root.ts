import { FastifyInstance } from 'fastify';

export default async function (f: FastifyInstance) {
  f.get('*', async function () {
    return { message: 'This route does not exist' };
  });

  f.get('/', async function () {
    return { message: 'Welcome to the payments-challenge API' };
  });
  
}
