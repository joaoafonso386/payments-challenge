import { initDbValidation } from './db/db';
import { Db, MongoClient } from 'mongodb';
import { externalFetch, newShopkeeperRegister, newUserLogin, newUserRegister, newUserTransfer } from './mocks/mocks';
import Fastify, { FastifyInstance } from 'fastify';
import { api } from '../api';

jest.mock('jsonwebtoken', () => ({
  sign: () => "tokentest123",
  verify: () => ({
    email: "test@gmail.com",
    type: "user"
  })
}))


describe('Payments Challenge API', () => {
  let server: FastifyInstance;
  let connection: MongoClient;
  let db: Db;


  beforeAll(async () => {
    process.env.MONGO_CONNECTION_STRING = process.env.MONGO_URL
    connection = await MongoClient.connect(process.env.MONGO_URL as string);
    db = connection.db();
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

  it('registers a shopkeeper ', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: newShopkeeperRegister
    });

    expect(response.json().status).toEqual('200');
    expect(response.json()).toEqual({ msg: 'You are registered!', status: response.json().status });
  });

  //registers invalid user

  it('logs a valid user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: newUserLogin
    });

    expect(response.json()).toEqual({ message: 'Your are logged in!', token: 'tokentest123' });
  });

  it('transfers to a shopkeeper', async () => {

    jest.spyOn(global, 'fetch').mockImplementationOnce(async () => Promise.resolve(externalFetch) as unknown as Response);

    const response = await server.inject({
      method: 'POST',
      url: '/transfer',
      payload: newUserTransfer,
      headers: {
        authorization: "Bearer tokentest123"
      }
    });

    expect(response.json()).toEqual({ msg: 'Transfer made' });
  });

  it('reverts a transfer by its id', async () => {

    const lastTransfer = await db.collection('transfers').find({}).toArray()
    const id = lastTransfer[0]._id.toString()

    const response = await server.inject({
      method: 'POST',
      url: '/transfer/revert',
      payload: {
        transferId: id
      },
      headers: {
        authorization: "Bearer tokentest123"
      }
    });

    expect(response.json()).toEqual({ msg: 'Transfer reverted' });
  });

});
