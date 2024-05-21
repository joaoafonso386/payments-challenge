import { initDbValidation } from './../validators/db/db';
import { Db, MongoClient } from 'mongodb';
import { newUserLogin, newUserRegister } from './mocks/registerMock';
import Fastify, { FastifyInstance } from 'fastify';
import { api } from '../api';

describe('Payments Challenge API', () => {
  let server: FastifyInstance;
  let connection: MongoClient;
  let db: Db;


  beforeAll(async () => {
    process.env.MONGO_CONNECTION_STRING = process.env.MONGO_URL
    connection = await MongoClient.connect(process.env.MONGO_URL as string);
    db = await connection.db();
    await initDbValidation(db)
  })

  afterAll(async () => {
    await connection.close();
  })

  beforeEach(async () => {
    server = Fastify();
    server.register(api)
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
      payload: newUserRegister
    });

    expect(response.json().status).toEqual('200');
    expect(response.json()).toEqual({ msg: 'You are registered!', status: response.json().status });
  });


  it('logs a user ', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: newUserLogin
    });

    expect(response.json().status).toEqual('200');
    expect(response.json()).toEqual({ msg: 'You are registered!', status: response.json().status });
  });

});
