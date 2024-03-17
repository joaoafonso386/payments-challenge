db = db.getSiblingDB('payments');

db.createCollection('users');

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ postCode: 1 }, { unique: true });

db.users.insert([
  {
    user: 'John',
    surname: 'Doe',
    postCode: '1800-057',
    email: 'john@doe.com',
    pwd: 'unhashed pwd',
    type: 'user',
  },
  {
    user: 'Mary',
    surname: 'Doe',
    postCode: '1800-051',
    email: 'mary@doe.com',
    pwd: 'unhashed pwd',
    type: 'shopkeeper',
  },
]);
