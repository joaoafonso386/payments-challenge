import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongo from '@fastify/mongodb'

/**
 * This plugins adds connections to a mongodb database
 *
 * @see https://github.com/fastify/fastify-mongodb
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(mongo, {
    forceClose: true,
    url: ''
  });
})
