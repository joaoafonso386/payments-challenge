import { TokenPayload, User, UserType } from '../types/types';
import { FastifyInstance } from 'fastify';

export default async function transfer(f: FastifyInstance) {
  f.post<{ Body: { receiver: string; amount: string, token: TokenPayload } }>(
    '/transfer',
    async (req, res) => {

      const token = req.body.token
      const receiverEmail = req.body.receiver;
      const amount = parseInt(req.body.amount);

      try {
        
        if (token.type !== UserType.USER) {
          throw new Error('You are not a user, transfers are not available');
        }
        if (token.email === receiverEmail) {
          throw new Error('You cannot transfer to yourself');
        }
        const usersCollection = f.mongo.db?.collection('users');
        const users =
          (await usersCollection
            ?.find<User>({ email: { $in: [token.email, receiverEmail] } })
            .toArray()) || [];
        if (users?.length < 2) {
          throw new Error('Receiver or sender does not exist');
        }
        const [sender, receiver] = users.sort((a) =>
          a.email === token.email ? -1 : 0
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
          sender: token.email,
          receiver: receiver.email,
          amount,
          date: new Date(Date.now()).toISOString(),
        });
        req.log.info("Transfer registered")
        await usersCollection?.updateMany(
          { $or: [{ email: token.email }, { email: receiver.email }] },
          [
            {
              $set: {
                balance: {
                  $cond: {
                    if: { $eq: ['$email', token.email] },
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
        throw new Error(`${e}`);
      }

      return res.code(200).send({ msg: 'Transfer made' });
    }
  );
}
