import fp from "fastify-plugin";
import { fastifyMiddie as middie} from '@fastify/middie';
import { FastifyInstance } from "fastify";
import { auth } from './auth';

/**
 * This plugins adds middleware capabilities (more than just fastify hooks)
 *
 * @see https://github.com/fastify/middie
 */

export default fp(async (f: FastifyInstance, opts) => {
    await f.register(middie);
    f.use('/transfer', auth); // Apply only to route /transfer. Flexible for pattern/dir like routes
})
  