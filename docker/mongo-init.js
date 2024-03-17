db = db.getSiblingDB('payments')

db.createCollection('users');

db.users.insert({
  user: 'John',
  pwd: 'Doe',
  roles: [
    {
      role: 'readWrite',
      db: 'payments',
    },
  ],
});
