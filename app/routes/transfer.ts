import { TokenPayload, Transfer, User, UserType } from '../types/types';
import { FastifyInstance } from 'fastify';
import { isEmpty } from '../utils/utils';
import { ObjectId } from '@fastify/mongodb';

export default async function transfer(f: FastifyInstance) {
  f.post<{ Body: { receiver: string, amount: string, token: TokenPayload } }>(
    '/transfer',
    async (req, res) => {

      const token = req.body.token
      const receiverEmail = req.body.receiver;
      const amount = parseInt(req.body.amount);
      let session: any;

      try {
        if (token.type !== UserType.USER) {
          throw new Error('You are not a user, transfers are not available');
        }
        const usersCollection = f.mongo.db?.collection('users');
        const users =
          (await usersCollection
            ?.find<User>({ email: { $in: [token.email, receiverEmail] } })
            .toArray()) || [];
        if (users?.length < 2) {
          throw new Error('Receiver or sender does not exist. Please verify the provided emails for transfer');
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
        session = f.mongo.client.startSession()

        await session.withTransaction(async () => {
          await transfersCollection?.insertOne({
            sender: token.email,
            receiver: receiver.email,
            amount,
            date: new Date(Date.now()).toISOString(),
          }, { session });
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
          , { session });
          req.log.info("Balance updated for sender and receiver")
        })
      } catch (e: unknown) {
        throw new Error(`${e}`);
      } finally {
        await session?.endSession();
      }

      return res.code(200).send({ msg: 'Transfer made' });
    }
  );

  f.post<{ Body: { transferId?: string, token: TokenPayload } }>('/transfer/revert', async (req, res) => {

    const token = req.body.token
    const transferId = req.body.transferId

    if (token.type !== UserType.USER) {
      throw new Error('You are not a user, you can not revert a transfer');
    }

    const transfersCollection = f.mongo.db?.collection('transfers')
    const usersCollection = f.mongo.db?.collection('users');
    let lasTransaction;

    if(transferId) {
      lasTransaction = await transfersCollection?.findOne<Transfer>({ sender: token.email, _id: new ObjectId(transferId) }) as Transfer || {}
    } else {
      lasTransaction = await transfersCollection?.findOne<Transfer>({ sender: token.email, }, { sort: { date: -1 }}) as Transfer || {}
    }

    if(isEmpty(lasTransaction)) {
      throw new Error("There are no transactions currently")
    }

    const { _id, amount, receiver } = lasTransaction 
    
    await usersCollection?.updateMany(
      { $or: [{ email: token.email }, { email: receiver }] },
      [
        {
          $set: {
            balance: {
              $cond: {
                if: { $eq: ['$email', token.email] },
                then: { $add: ["$balance", amount] },
                else: { $subtract: ["$balance", amount] },
              },
            },
          },
        }
      ]
    )

    await transfersCollection?.deleteOne({ _id });
  

    return res.code(200).send({ msg: 'Transfer reverted' });

  })
}
