import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('*', async function () {
    return { message: 'This route does not exist' };
  });

  fastify.get('/', async function () {
    const users = this.mongo.db.collection('users')
    const { name } = await users.findOne({ "name": "João Afonso" })
    return { message: 'Welcome to the payments-challenge API', myName: name };
  });
  
}
