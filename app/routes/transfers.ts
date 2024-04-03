import { FastifyInstance } from "fastify";

//logic for a payment (transfer)
export default async function register (f: FastifyInstance) {
    f.post<{ Body: unknown }>('/transfer', async (req, res) => {
      return res.code(200).send({ msg: "Transfer made" })
    });
    
}