import { TokenPayload, User, UserType } from "../types/types";
import { FastifyInstance } from "fastify";
import { JsonWebTokenError, verify } from "jsonwebtoken";

export default async function transfer (f: FastifyInstance) {
    f.post<{ Body: { receiver: string, amount: string } }>('/transfer', async (req, res) => {

      if(!req.headers.authorization) throw new Error("Authorization header is missing")
      
      const tokenParts = req.headers.authorization?.split(" ")
      const receiver = req.body.receiver
      const amount = parseInt(req.body.amount)

      if(tokenParts.length !== 2 || tokenParts[0] !== "Bearer") throw new Error("Invalid authorization header format")
      
      const token = tokenParts[1]

      try {
        const senderToken = verify(token, `${process.env.SECRET_KEY}`) as TokenPayload
        if(senderToken.type !== UserType.USER) {
          throw new Error("You are not a user, transfers are not available")
        }
        const usersCollection =  f.mongo.db?.collection('users')
        const users = await usersCollection?.find<User>({ email: { $in: [senderToken.email, receiver] }}).toArray() || []
        if(users?.length < 2) {
          throw new Error("Receiver or sender does not exist")
        }
        const sender = users.find(user => user.email === senderToken.email)
        const balance = sender?.balance || 0
        if(amount > balance) {
          throw new Error("Insufficient funds for transfer")
        }

        const service = await fetch("https://util.devi.tools/api/v2/authorize")
        const { data } = await service.json()
        if(!data.authorization) {
          throw new Error("External confirmation not guaranteed")
        }

      } catch (e: unknown) {
        if(e instanceof JsonWebTokenError){
          throw new Error("Invalid token")
        }
        throw new Error(`${e}`)
      }

     

      return res.code(200).send({ msg: "Transfer made" })
    });
    
}