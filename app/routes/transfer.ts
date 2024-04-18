import { TokenPayload, User, UserType } from "../types/types";
import { FastifyInstance } from "fastify";
import { verify } from "jsonwebtoken";

//logic for a payment (transfer)
export default async function transfer (f: FastifyInstance) {
    f.post<{ Body: { receiver: string, amout: string } }>('/transfer', async (req, res) => {

      if(!req.headers.authorization) throw new Error("Authorization header is missing")
      
      const tokenParts = req.headers.authorization?.split(" ")
      const receiver = req.body.receiver
      const amout = parseInt(req.body.amout)

      if(tokenParts.length !== 2 || tokenParts[0] !== "Bearer") throw new Error("Invalid authorization header format")
      
      const token = tokenParts[1]

      try {
        const userToken = verify(token, `${process.env.SECRET_KEY}`) as TokenPayload
        if(userToken.type !== UserType.USER) {
          throw new Error("You are not a user, transfers are not available")
        }
        const usersCollection =  f.mongo.db?.collection('users')
        const users = await usersCollection?.find<User>({ email: { $in: [userToken.email, receiver] }}).toArray()
        // if(user?.balance|| 0 < amout) {
        //   throw new Error("Insufficient founds for transaction")
        // }
      } catch {
        throw new Error("Invalid Token")
      }



      return res.code(200).send({ msg: "Transfer made" })
    });
    
}