import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';

/* eslint-disable-next-line */
export interface AppOptions {}

export const api = async (f: FastifyInstance, opts: AppOptions) => {
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused through your application
  f.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  f.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });

}