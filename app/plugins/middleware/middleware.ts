import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { authHandler } from './auth';


/**
 * This plugins adds middleware capabilities (more than just fastify hooks)
 *
 * @see https://github.com/fastify/middie
 */

export default fp(async (f: FastifyInstance, opts) => {
    f.addHook('preValidation', authHandler)
})
  