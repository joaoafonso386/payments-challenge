import Fastify, { FastifyInstance } from 'fastify';
import { api } from '../api';

//need to mock mongo db

describe('Payments Challenge API', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = Fastify();
    server.register(api);
  });

  it('healthcheck root endpoint ping', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.json()).toEqual({ message: 'Welcome to the payments-challenge API!' });
  });

  it('ping a non existent route ', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/payment',
    });

    expect(response.json()).toEqual({ message: 'This route does not exist' });
  });

});
