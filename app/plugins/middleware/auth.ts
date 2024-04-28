export const authHandler = (req:  any, res: any, next: any) => { 
  const restricted = ["/transfer"]

  if (!restricted.includes(req.routerPath)) {
      return next()
  }

  if (!req.headers.authorization)
      throw new Error('Authorization header is missing');

  const tokenParts = req.headers.authorization?.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer')
    throw new Error('Invalid authorization header format');

  const token = tokenParts[1];

  req.body.token = token

  return next()
  
 }
