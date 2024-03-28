import fp from "fastify-plugin";
import { fastifyMiddie as middie} from '@fastify/middie';
import { FastifyInstance } from "fastify";

/**
 * This plugins adds middleware capabilities
 *
 * @see https://github.com/fastify/middie
 */

export default fp(async function (f: FastifyInstance) {
    await f.register(middie);
})
  