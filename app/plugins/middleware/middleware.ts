import fp from "fastify-plugin";
import { fastifyMiddie as middie} from '@fastify/middie';
import { FastifyInstance } from "fastify";
import { auth } from './auth';

/**
 * This plugins adds middleware capabilities
 *
 * @see https://github.com/fastify/middie
 */

export default fp(async (f: FastifyInstance, opts) => {
    await f.register(middie);
    f.use('/transfer', auth); // Apply to route only to route /transfer. Flexible for pattern/dir like routes
})
  