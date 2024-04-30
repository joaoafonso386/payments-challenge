import { TokenPayload } from "app/types/types";
import { verify } from "jsonwebtoken";

export const authHandler = (req:  any, res: any, next: any) => { 
  const patterns = [
    /^\/transfer(\/.*)?$/
  ]

  if (!patterns.some(pattern => pattern.test(req.routerPath))) {
      return next()
  }

  if (!req.headers.authorization)
      throw new Error('Authorization header is missing');

  const tokenParts = req.headers.authorization?.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer')
    throw new Error('Invalid authorization header format');

  const token = tokenParts[1];
  let senderToken;

  try {
    senderToken = verify(
      token,
      `${process.env.SECRET_KEY}`
    ) as TokenPayload;
  } catch {
    throw new Error('Invalid token');
  }

  req.body.token = { type: senderToken?.type, email: senderToken?.email }

  return next()
  
 }
