import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/login', async function () {
    return { message: 'Hello to login' };
  });
  
}