import { TokenPayload, UserType } from "app/types/types";
import { verify } from "jsonwebtoken";

export const authHandler = (req:  any, res: any, next: any) => { 
  const patterns = [
    /^\/transfer(\/.*)?$/
  ]

  if (!patterns.some(pattern => pattern.test(req.routerPath))) {
      return next()
  }
  const tokenParts = req.headers.authorization?.split(' ');

  if (!req.headers.authorization || tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    throw new Error('Invalid authorization header format');
  }

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



  if (senderToken.type !== UserType.USER) {
    throw new Error('You are not a user, transfers are not available');
  }

  req.body.token = { type: senderToken?.type, email: senderToken?.email }

  return next()
  
 }
