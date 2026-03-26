# Deployment Simple - Build Local, Deploy en EC2

La forma más simple: construye la imagen en tu PC, súbela a EC2 y levántala.

## Ventajas
- ✅ No necesitas Docker Hub
- ✅ No necesitas clonar código en EC2
- ✅ Build rápido en tu PC potente
- ✅ Solo 3 archivos a subir

---

## Paso 1: Construir Imagen Localmente (En tu PC)

```powershell
# Construir y guardar imagen
.\build-local.ps1
```

Esto creará un archivo `cardionova.tar` (aproximadamente 500MB-1GB).

---

## Paso 2: Subir Archivos a EC2 (Desde tu PC)

Necesitas subir 3 archivos:

```powershell
# 1. Subir imagen Docker
scp -i "cardionova.pem" cardionova.tar ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com:~/

# 2. Subir docker-compose
scp -i "cardionova.pem" docker-compose.prod-local.yml ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com:~/

# 3. Crear y subir .env
@"
JWT_SECRET=8f2a7c4d9e6b3f8a2e5d7c9b4f6a8e3d2c5b7a9f4e6d8c2a5e7b9f3d6c4a8e2d
REFRESH_TOKEN_SECRET=9f8e7d6c5b4a3e2d1c8b7a6f5e4d3c2b1a9f8e7d6c5b4a3e2d1c8b7a6f5e4d3c
"@ | Out-File -FilePath .env.prod -Encoding UTF8

scp -i "cardionova.pem" .env.prod ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com:~/.env
```

**Nota:** La subida del archivo .tar puede tomar varios minutos dependiendo de tu conexión.

---

## Paso 3: Configurar EC2 (Solo primera vez)

Conecta a EC2:
```bash
ssh -i "cardionova.pem" ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com
```

Instala Docker:
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo apt install docker-compose -y

# Configurar firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw --force enable

# Salir para aplicar cambios
exit
```

Reconecta:
```bash
ssh -i "cardionova.pem" ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com
```

---

## Paso 4: Cargar Imagen y Desplegar (En EC2)

```bash
# Verificar archivos
ls -lh

# Cargar imagen Docker
docker load -i cardionova.tar

# Verificar que la imagen se cargó
docker images | grep cardionova

# Levantar servicios
docker-compose -f docker-compose.prod-local.yml up -d

# Ver logs
docker-compose -f docker-compose.prod-local.yml logs -f
```

---

## Paso 5: Ejecutar Seeds

```bash
# Esperar 10-20 segundos a que la app inicie
sleep 15

# Ejecutar seeds
docker exec cardionova-app npm run seed:users create
```

---

## Paso 6: Verificar

```bash
# Ver contenedores corriendo
docker ps

# Obtener IP pública
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Ver logs
docker-compose -f docker-compose.prod-local.yml logs -f app
```

Accede en tu navegador: `http://44.204.140.25`

---

## Actualizar la Aplicación

Cuando hagas cambios al código:

### En tu PC:
```powershell
# 1. Rebuild
.\build-local.ps1

# 2. Subir nueva imagen
scp -i "cardionova.pem" cardionova.tar ubuntu@ec2-44-204-140-25.compute-1.amazonaws.com:~/
```

### En EC2:
```bash
# 1. Detener app
docker-compose -f docker-compose.prod-local.yml down

# 2. Cargar nueva imagen
docker load -i cardionova.tar

# 3. Levantar de nuevo
docker-compose -f docker-compose.prod-local.yml up -d
```

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose -f docker-compose.prod-local.yml logs -f

# Reiniciar solo la app
docker-compose -f docker-compose.prod-local.yml restart app

# Detener todo
docker-compose -f docker-compose.prod-local.yml down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose -f docker-compose.prod-local.yml down -v

# Ver uso de recursos
docker stats

# Limpiar imágenes antiguas
docker image prune -a
```

---

## Troubleshooting

### Error: "No space left on device"
```bash
# Limpiar imágenes y contenedores no usados
docker system prune -a
```

### La subida del .tar es muy lenta
- Usa una conexión más rápida
- O considera usar Docker Hub en su lugar

### Error al cargar imagen
```bash
# Verificar integridad del archivo
ls -lh cardionova.tar

# Resubir si es necesario
```

---

## Resumen del Flujo Completo

**Primera vez:**
1. PC: `.\build-local.ps1`
2. PC: Subir archivos con `scp`
3. EC2: Instalar Docker
4. EC2: `docker load -i cardionova.tar`
5. EC2: `docker-compose -f docker-compose.prod-local.yml up -d`
6. EC2: `docker exec cardionova-app npm run seed:users create`

**Actualizaciones:**
1. PC: `.\build-local.ps1`
2. PC: `scp cardionova.tar...`
3. EC2: `docker-compose down && docker load -i cardionova.tar && docker-compose up -d`

¡Listo! Tu aplicación está corriendo en EC2.
