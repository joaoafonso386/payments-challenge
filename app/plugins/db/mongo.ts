import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongodb from '@fastify/mongodb'

/**
 * This plugins adds connections to a mongodb database
 *
 * @see https://github.com/fastify/fastify-mongodb
 */

export default fp(async function (f: FastifyInstance) {
    f.register(mongodb, {
      forceClose: true,
      url: `${process.env.MONGO_CONNECTION_STRING}`,
    });
})
