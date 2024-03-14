import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('*', async function () {
    return { message: 'This route does not exist' };
  });

  fastify.get('/', async function () {
    return { message: 'Welcome to the payments-challenge API' };
  });
  
}
