import { newUser } from './mocks/registerMock';
import Fastify, { FastifyInstance } from 'fastify';
import { api } from '../api';

//need to mock mongo db

describe('Payments Challenge API', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = Fastify();
    server.register(api);
  });

  afterEach(async () => {
    await server.close()
  })

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

  it('registers a user ', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: newUser
    });

    expect(response.json().status).toEqual('200');
    expect(response.json()).toEqual({ message: 'You are registered!' });
  });

});
