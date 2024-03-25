import Fastify from 'fastify';
import { api } from './api';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: {
    level: 'info',
    redact: {
      paths: ["pid", "hostname", "reqId", "req.remoteAddress", "req.remotePort", "req.method"],
      remove: true
    }
  }
});

// Register your application as a normal plugin.
server.register(api);

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ READY ] http://${host}:${port}`);
    console.log(`[ CONNECTED ] Mongo DB`);
  }
});
