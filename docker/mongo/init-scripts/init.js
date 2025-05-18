// Script para crear usuario inicial y base de datos
db = db.getSiblingDB('cardionova');

// Crear usuario de aplicación
db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'cardionova'
    }
  ]
});

// Crear índices importantes
db.users.createIndex({ email: 1 }, { unique: true });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
