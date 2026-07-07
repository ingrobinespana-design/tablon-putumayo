# Tablón Putumayo — Marketplace de ganado en pie

Plataforma simple para que ganaderos publiquen animales y reciban varias
ofertas de compradores (otros ganaderos, criadores, comisionistas), en lugar
de depender de un solo comprador local.

## Cómo funciona

1. **Cualquiera publica un animal** sin necesidad de cuenta — foto, raza, peso,
   precio esperado, datos de contacto. Queda en estado **pendiente**.
2. **El administrador (tú) revisa y aprueba** antes de que se vea en el
   catálogo público. Esto evita spam y publicaciones falsas.
3. **Los compradores ven el catálogo** sin necesidad de cuenta. Pueden:
   - Escribir directo por WhatsApp al propietario (botón de un clic).
   - Registrar una oferta formal con monto, para que quede trazabilidad.
4. **Cuando se cierra una venta**, marcas en el panel cuál oferta ganó y el
   sistema calcula automáticamente tu comisión sobre la mejora de precio.

## Estructura del proyecto

```
ganaderia-app/
├── backend/      → API en FastAPI + PostgreSQL
└── frontend/     → Interfaz en React (Vite)
```

## Backend — instalación local

```bash
cd backend
pip install -r requirements.txt --break-system-packages
cp .env.example .env
# Edita .env con tu DATABASE_URL real y cambia ADMIN_CLAVE
uvicorn main:app --reload --port 8000
```

La API queda en http://localhost:8000. Las tablas se crean solas al
arrancar (no necesitas correr migraciones para esta primera versión).

## Frontend — instalación local

```bash
cd frontend
npm install
cp .env.example .env
# Asegúrate que VITE_API_URL apunte a tu backend
npm run dev
```

## Despliegue (igual que hiciste con Orito Domi)

### Backend en Railway
1. Crea un nuevo proyecto en Railway, conecta este repo (carpeta backend).
2. Agrega un servicio de PostgreSQL — Railway te da el DATABASE_URL
   automáticamente, cópialo a las variables de entorno del servicio backend.
3. Define la variable ADMIN_CLAVE con una clave fuerte (esta es la
   contraseña para entrar a /admin).
4. Comando de arranque: uvicorn main:app --host 0.0.0.0 --port $PORT

### Frontend en Vercel
1. Importa la carpeta frontend como proyecto en Vercel.
2. Define la variable de entorno VITE_API_URL apuntando a la URL pública
   de tu backend en Railway (ej: https://tu-backend.up.railway.app).
3. Deploy. Vercel detecta Vite automáticamente.

## Panel de administración

Entra a /admin en el frontend desplegado, ingresa la ADMIN_CLAVE que
configuraste, y desde ahí:
- Apruebas o rechazas publicaciones nuevas (pestaña "Por revisar").
- Ves las ofertas de cada animal disponible.
- Cierras la venta seleccionando la oferta ganadora — el sistema calcula
  la comisión automáticamente según el % que definas en ese momento.

## Próximos pasos sugeridos (cuando ya tengas tracción)

- Cambiar la clave única de admin por login real con roles si suman más
  personas al equipo.
- Agregar envío automático del aviso a la lista de compradores por
  WhatsApp Business API (hoy el contacto es manual vía botón wa.me).
- Mover el rate-limit de publicaciones de memoria a Redis si el tráfico crece.
