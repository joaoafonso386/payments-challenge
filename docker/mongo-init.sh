#!bin/bash

set -e

mongo <<EOF

db = db.getSiblingDB('payments')

db.createUser({
  user: 'user',
  pwd: 'pass',
  roles: [{ role: 'readWrite', db: 'payments' }],
});

EOF
