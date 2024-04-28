import { TokenPayload, User, UserType } from '../types/types';
import { FastifyInstance } from 'fastify';
import { JsonWebTokenError, verify } from 'jsonwebtoken';

export default async function transfer(f: FastifyInstance) {
  f.post<{ Body: { receiver: string; amount: string, token: any } }>(
    '/transfer',
    async (req, res) => {
      //values coming form middleware
      console.log(req.body.token)
      if (!req.headers.authorization)
        throw new Error('Authorization header is missing');

      const tokenParts = req.headers.authorization?.split(' ');
      const receiverEmail = req.body.receiver;
      const amount = parseInt(req.body.amount);

      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer')
        throw new Error('Invalid authorization header format');

      const token = tokenParts[1];

      try {
        const senderToken = verify(
          token,
          `${process.env.SECRET_KEY}`
        ) as TokenPayload;
        if (senderToken.type !== UserType.USER) {
          throw new Error('You are not a user, transfers are not available');
        }
        if (senderToken.email === receiverEmail) {
          throw new Error('You cannot transfer to yourself');
        }
        const usersCollection = f.mongo.db?.collection('users');
        const users =
          (await usersCollection
            ?.find<User>({ email: { $in: [senderToken.email, receiverEmail] } })
            .toArray()) || [];
        if (users?.length < 2) {
          throw new Error('Receiver or sender does not exist');
        }
        const [sender, receiver] = users.sort((a) =>
          a.email === senderToken.email ? -1 : 0
        );
        const balance = sender?.balance ?? 0;
        if (amount > balance) {
          throw new Error('Insufficient funds for transfer');
        }

        const service = await fetch("https://util.devi.tools/api/v2/authorize")
        const { data } = await service.json()
        if(!data.authorization) {
          throw new Error("External confirmation not guaranteed")
        }

        const transfersCollection = f.mongo.db?.collection('transfers');

        await transfersCollection?.insertOne({
          sender: senderToken.email,
          receiver: receiver.email,
          amount,
          date: new Date(Date.now()).toISOString(),
        });
        req.log.info("Transfer registered")
        await usersCollection?.updateMany(
          { $or: [{ email: senderToken.email }, { email: receiver.email }] },
          [
            {
              $set: {
                balance: {
                  $cond: {
                    if: { $eq: ['$email', senderToken.email] },
                    then: { $subtract: ["$balance", amount] },
                    else: { $add: ["$balance", amount] },
                  },
                },
              },
            }
          ]
        );
        req.log.info("Balance updated for sender and receiver")
      } catch (e: unknown) {
        if (e instanceof JsonWebTokenError) {
          throw new Error('Invalid token');
        }
        throw new Error(`${e}`);
      }

      return res.code(200).send({ msg: 'Transfer made' });
    }
  );
}
