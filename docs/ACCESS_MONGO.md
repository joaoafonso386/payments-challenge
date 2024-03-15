# STEPS FOR DOCKER

- Create compose file with mongodb instance and UI (if needed)
- Create DB via mongo UI
- Create user via mongo CLi
    - Enter mongodb container with root user (defined in compose file with env variables) -> docker exec -it <MONGO_CONTAINER_NAME> mongosh -u "<USER>" -p "<PASSWORD>"
    - switch to the correct DB -> use <MONGO_DB_NAME>
    - Execute a create user command with mongo CLI -> db.createUser({ user: "<USER>", pwd: "<PASSWORD>", roles: [{ role: "readWrite", db: "<MONGO_DB_NAME>"}]})

- Connection string for mongo client should be: mongodb://<USER>:<PASS>@<URL || localhost>:<PORT>/<DB_NAME>
    - EX "mongodb://zigoto:zigoto@localhost:27017/payments"
