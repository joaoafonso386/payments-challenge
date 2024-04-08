db = db.getSiblingDB('payments');

db.createUser({
  user: "zigoto",
  pwd: "zigoto",
  roles: [ { role: "dbOwner", db: "payments" } ]
})


db.createCollection('users', {
  validator: {
    $jsonSchema: {
      required: [ "name", "postCode", "email", "pwd", "type" ],
      bsonType: 'object',
      additionalProperties: false,
      title: 'Users validation',
      properties: {
        _id: { 
          bsonType: "objectId" ,
        },
        name: {
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
        },
        balance: {
          bsonType: "int",
          description: "Must be an int"
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
    type: 'user'
  },
  {
    name: 'Mary Doe',
    postCode: '1800-051',
    email: 'mary@doe.com',
    pwd: 'unhashed pwd',
    type: 'shopkeeper',
  },
]);

db.createCollection('transfers', {
  validator: {
    $jsonSchema: {
      required: ["sender", "receiver", "amout"],
      bsonType: 'object',
      additionalProperties: false,
      title: 'Transfers validation',
      properties: {
        _id: { 
          bsonType: "objectId" ,
        },
        sender: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        receiver: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        amount: {
          bsonType: "int",
          description: "must be a string and is required"
        }
      },
    },
  },
});

