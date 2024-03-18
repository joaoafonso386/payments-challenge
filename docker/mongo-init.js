db = db.getSiblingDB('payments');

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      required: [ "name", "postCode", "email", "pwd", "type" ],
      bsonType: 'object',
      title: 'Users validation',
      properties: {
        user: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        postCode: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        pwd: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        type: {
          bsonType: "string",
          enum: [ "user", "shopkeeper" ],
          description: "Must be either user, or shopkeeper"
        }
      },
    },
  },
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ postCode: 1 }, { unique: true });

db.users.insertMany([
  {
    name: 'John Doe',
    postCode: '1800-057',
    email: 'john@doe.com',
    pwd: 'unhashed pwd',
    type: 'user',
  },
  {
    name: 'Mary Doe',
    postCode: '1800-051',
    email: 'mary@doe.com',
    pwd: 'unhashed pwd',
    type: 'shopkeeper',
  },
]);
