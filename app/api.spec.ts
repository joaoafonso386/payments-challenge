import Fastify, { FastifyInstance } from 'fastify';
import { api } from './api';

//need to mock mongo db

describe('GET /', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = Fastify();
    server.register(api);
  });

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.json()).toEqual({ message: 'Hello API' });
  });
});
