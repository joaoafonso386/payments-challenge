import { createTransfer, initDbValidation } from './db/db'
import { Db, MongoClient } from 'mongodb'
import {
    externalFetchFail,
    externalFetchSuccess,
    newShopkeeperRegister,
    newUserLogin,
    newUserRegister,
    newUserTransfer,
} from './mocks/mocks'
import Fastify, { FastifyInstance } from 'fastify'
import { api } from '../api'
import * as jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
    sign: () => 'tokentest123',
    verify: jest.fn(() => ({ email: 'test@gmail.com', type: 'user' })),
}))

jest.spyOn(global.Math, 'random').mockReturnValue(1);
jest.spyOn(global, 'fetch').mockImplementation(
    async () => Promise.resolve(externalFetchSuccess) as unknown as Response
)


describe('Payments Challenge API', () => {
    let server: FastifyInstance
    let connection: MongoClient
    let db: Db

    beforeAll(async () => {
        process.env.MONGO_CONNECTION_STRING = process.env.MONGO_URL
        connection = await MongoClient.connect(process.env.MONGO_URL as string)
        db = connection.db()
        await initDbValidation(db)
    })

    afterAll(async () => {
        await connection.close()
    })

    beforeEach(async () => {
        server = Fastify()
        server.register(api)
    })

    afterEach(async () => {
        await server.close()
    })

    it('healthcheck root endpoint ping', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/',
        })

        expect(response.json()).toEqual({
            message: 'Welcome to the payments-challenge API!',
        })
    })

    it('ping a non existent route ', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/payment',
        })

        expect(response.json()).toEqual({
            message: 'This route does not exist',
        })
    })

    it('registers a valid user ', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/register',
            payload: newUserRegister,
        })

        expect(response.json().status).toEqual('200')
        expect(response.json()).toEqual({
            msg: 'You are registered!',
            status: response.json().status,
        })
    })

    it('registers invalid user ', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/register',
            payload: {},
        })

        expect(response.json()).toEqual({
            error: "Must provide name, password, email, post code and type. Must have a valid postCode and email. Provided {}",
            msg: "You are not registered!",
            status: response.json().status,
        })
    })

    it('registers a valid shopkeeper ', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/register',
            payload: newShopkeeperRegister,
        })

        expect(response.json().status).toEqual('200')
        expect(response.json()).toEqual({
            msg: 'You are registered!',
            status: response.json().status,
        })
    })

    it('logs in a valid user', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/login',
            payload: newUserLogin,
        })

        expect(response.json()).toEqual({
            message: 'Your are logged in!',
            token: 'tokentest123',
        })
    })

    it('transfers to a shopkeeper', async () => {

        const response = await server.inject({
            method: 'POST',
            url: '/transfer',
            payload: newUserTransfer,
            headers: {
                authorization: 'Bearer tokentest123',
            },
        })

        expect(response.json()).toEqual({ msg: 'Transfer made' })
    })

    it('fails transferring from shopkeeper to user', async () => {
        jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({
            email: 'test@gmail.com',
            type: 'shopkeeper',
        }))

        const response = await server.inject({
            method: 'POST',
            url: '/transfer',
            payload: newUserTransfer,
            headers: {
                authorization: 'Bearer tokentest123',
            },
        })

        expect(response.json()).toEqual({
            error: 'Internal Server Error',
            message: 'You are not a user, transfers are not available',
            statusCode: 500,
        })

    })

    it('fails transferring because of invalid token format', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/transfer',
            payload: newUserTransfer,
            headers: {
                authorization: 'tokentest123',
            },
        })

        expect(response.json()).toEqual({
            error: 'Internal Server Error',
            message: 'Invalid authorization header format',
            statusCode: 500,
        })
    })

    it('fails transferring because of external service', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(
            async () => Promise.resolve(externalFetchFail) as unknown as Response
        )
        
        const response = await server.inject({
            method: 'POST',
            url: '/transfer',
            payload: newUserTransfer,
            headers: {
                authorization: 'Bearer tokentest123',
            },
        })

        expect(response.json()).toEqual({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Error: External confirmation not guaranteed'
          })
    })

    it('reverts a transfer by its id', async () => {
        const lastTransfer = await db.collection('transfers').find({}).toArray()
        const id = lastTransfer[0]._id.toString()

        const response = await server.inject({
            method: 'POST',
            url: '/transfer/revert',
            payload: {
                transferId: id,
            },
            headers: {
                authorization: 'Bearer tokentest123',
            },
        })

        expect(response.json()).toEqual({ msg: 'Transfer reverted' })
    })

    it('reverts last transfer', async () => {

        await createTransfer(server)

        const response = await server.inject({
            method: 'POST',
            url: '/transfer/revert',
            payload: {},
            headers: {
                authorization: 'Bearer tokentest123',
            },
        })

        expect(response.json()).toEqual({ msg: 'Transfer reverted' })
    })
})
