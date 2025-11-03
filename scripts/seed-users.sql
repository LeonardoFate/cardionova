-- Script para crear usuarios de prueba en Cardionova
-- Contraseña para todos: "admin123"
-- Hash generado con bcrypt (10 rounds): $2b$10$rKfL5vZ1Y0QE7nQfYx.x4eLqJGZ5vqE5VHKqN0F8pJxXqYqK7XQLS

-- Limpiar datos existentes (opcional)
-- DELETE FROM session;
-- DELETE FROM account;
-- DELETE FROM user;

-- Usuario 1: Administrador
INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
VALUES (
  'admin-user-001',
  'Dr. Carlos Administrador',
  'admin@cardionova.com',
  true,
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Account para el administrador (con contraseña)
INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES (
  'account-admin-001',
  'admin@cardionova.com',
  'credential',
  'admin-user-001',
  '$2b$10$rKfL5vZ1Y0QE7nQfYx.x4eLqJGZ5vqE5VHKqN0F8pJxXqYqK7XQLS',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Usuario 2: Doctor
INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
VALUES (
  'doctor-user-001',
  'Dra. María Rodríguez',
  'doctor@cardionova.com',
  true,
  'doctor',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Account para el doctor (con contraseña)
INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES (
  'account-doctor-001',
  'doctor@cardionova.com',
  'credential',
  'doctor-user-001',
  '$2b$10$rKfL5vZ1Y0QE7nQfYx.x4eLqJGZ5vqE5VHKqN0F8pJxXqYqK7XQLS',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Usuario 3: Secretaria
INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
VALUES (
  'secretary-user-001',
  'Ana López',
  'secretaria@cardionova.com',
  true,
  'secretary',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Account para la secretaria (con contraseña)
INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES (
  'account-secretary-001',
  'secretaria@cardionova.com',
  'credential',
  'secretary-user-001',
  '$2b$10$rKfL5vZ1Y0QE7nQfYx.x4eLqJGZ5vqE5VHKqN0F8pJxXqYqK7XQLS',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verificar los usuarios creados
SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u.email_verified
FROM "user" u
ORDER BY u.role, u.name;
