import { FastifyInstance } from "fastify";
import { verify } from "jsonwebtoken";

//logic for a payment (transfer)
export default async function transfer (f: FastifyInstance) {
    f.post<{ Body: unknown }>('/transfer', async (req, res) => {

      if(!req.headers.authorization) throw new Error("Authorization header is missing")
      
      const tokenParts = req.headers.authorization?.split(" ")

      if(tokenParts.length !== 2 || tokenParts[0] !== "Bearer") throw new Error("Invalid authorization header format")
      
      const token = tokenParts[1]
      const user = verify(token, `${process.env.SECRET_KEY}`) 
  
      console.log(user)

      return res.code(200).send({ msg: "Transfer made" })
    });
    
}