import { FastifyInstance } from 'fastify'
import { Db } from 'mongodb'

export const initDbValidation = async (db: Db) => {
    const users = await db.createCollection('users', {
        validator: {
            $jsonSchema: {
                required: ['name', 'postCode', 'email', 'pwd', 'type'],
                bsonType: 'object',
                additionalProperties: false,
                title: 'Users validation',
                properties: {
                    _id: {
                        bsonType: 'objectId',
                    },
                    name: {
                        bsonType: 'string',
                        description: 'must be a string and is required',
                    },
                    postCode: {
                        bsonType: 'string',
                        description: 'must be a string and is required',
                    },
                    email: {
                        bsonType: 'string',
                        description: 'must be a string and is required',
                    },
                    pwd: {
                        bsonType: 'string',
                        description: 'must be a string and is required',
                    },
                    type: {
                        bsonType: 'string',
                        enum: ['user', 'shopkeeper'],
                        description: 'Must be either user, or shopkeeper',
                    },
                    balance: {
                        bsonType: 'int',
                        description: 'Must be an int. Registered in USD',
                    },
                },
            },
        },
    })

    users.createIndex({ email: 1 }, { unique: true })
    users.createIndex({ postCode: 1 }, { unique: true })

    await db.createCollection('transfers', {
        validator: {
            $jsonSchema: {
                required: ['sender', 'receiver', 'amount', 'date'],
                bsonType: 'object',
                additionalProperties: false,
                title: 'Transfers validation',
                properties: {
                    _id: {
                        bsonType: 'objectId',
                    },
                    sender: {
                        bsonType: 'string',
                        description: 'must be a string and is required',
                    },
                    receiver: {
                        bsonType: 'string',
                        description: 'must be a string and is required',
                    },
                    amount: {
                        bsonType: 'int',
                        description: 'must be a string and is required',
                    },
                    date: {
                        bsonType: 'string',
                        description: 'must be an ISO date and is required',
                    },
                },
            },
        },
    })
}

export const createTransfer = async (server: FastifyInstance) => {
    await server.inject({
        method: 'POST',
        url: '/transfer',
        payload: {
            receiver: 'test2@gmail.com',
            amount: 300,
        },
        headers: {
            authorization: 'Bearer tokentest123',
        },
    })
}
