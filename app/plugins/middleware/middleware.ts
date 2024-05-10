import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { authHandler } from './auth';


/**
 * Custom middleware with fastify hooks
 * 
 */

export default fp(async (f: FastifyInstance, opts) => {
    f.addHook('preValidation', authHandler)
})
  