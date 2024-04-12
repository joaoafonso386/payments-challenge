import { FastifyInstance } from 'fastify';

export default async function root (f: FastifyInstance) {
  f.get('*', async () => ({
    message: 'This route does not exist' 
  }))

  f.get('/', async () => ({
    message: 'Welcome to the payments-challenge API!' 
  }))
  
}
