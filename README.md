 # Employees Frontend
 
 Aplicación web para la administración de empleados y departamentos. Permite consultar información operativa desde un dashboard, mantener los registros de la organización y trabajar con una API protegida mediante autenticación.
 
 ## Funcionalidades
 
 - Inicio y cierre de sesión con cookie HTTP-only.
 - Dashboard con estadísticas de empleados, departamentos y salarios.
 - Listado paginado de empleados.
 - Filtros por nombre, departamento y rango salarial.
 - Alta, edición y eliminación de empleados y departamentos.
 - Validación de formularios y manejo de errores de la API.
 - Protección de las vistas privadas y redirección al login cuando la sesión expira.
 
 ## Stack tecnológico
 
 - [Next.js 16](https://nextjs.org/) con App Router.
 - [React 19](https://react.dev/) y [TypeScript](https://www.typescriptlang.org/).
 - [Tailwind CSS 4](https://tailwindcss.com/).
 - API REST externa consumida mediante rutas internas de Next.js.
 - ESLint para análisis estático del código.
 
 ## Requisitos
 
 - Node.js 20 o superior.
 - npm 10 o superior.
 - Acceso a la API de empleados.
 
 ## Instalación
 
 1. Clona el repositorio y entra en la carpeta del proyecto.
 
 ```bash
 git clone <URL_DEL_REPOSITORIO>
 cd employees-frontend
 ```
 
 2. Instala las dependencias:
 
 ```bash
 npm install
 ```
 
 3. Crea `.env.local` en la raíz:
 
 ```dotenv
 NEXT_PUBLIC_API_URL=<URL_DE_TU_API>
 ```
 
 La variable debe contener únicamente la URL base del backend, sin una barra `/` al final. Define el valor real únicamente en tu entorno local o en la configuración privada del proveedor de despliegue.
 
 ## Ejecución
 
 Inicia el servidor de desarrollo:
 
 ```bash
 npm run dev
 ```
 
 Abre [http://localhost:3000](http://localhost:3000) en el navegador. La ruta `/login` es el punto de entrada; las operaciones de gestión están disponibles dentro de `/dashboard`.
 
 ## Scripts disponibles
 
 | Comando | Descripción |
 | --- | --- |
 | `npm run dev` | Inicia Next.js en modo desarrollo. |
 | `npm run build` | Genera el build optimizado de producción. |
 | `npm run start` | Sirve el build de producción. |
 | `npm run lint` | Ejecuta ESLint. |
 
 ## Arquitectura
 
 ```text
 src/
 ├── app/                  # Páginas, layouts y API routes de Next.js
 ├── components/           # Componentes reutilizables
 ├── services/             # Comunicación con la API y errores de dominio
 ├── types/                # Tipos TypeScript de entidades y respuestas
 └── proxy.ts              # Protección de navegación
 ```
 
 Las rutas del frontend consumen endpoints internos como `/api/employees` y `/api/departments`. Estas rutas centralizan la comunicación con el backend externo y la gestión de la sesión.
 
 ## Rutas principales
 
 | Ruta | Propósito |
 | --- | --- |
 | `/login` | Autenticación del usuario. |
 | `/dashboard` | Resumen, estadísticas y listado de empleados. |
 | `/dashboard/employees/new` | Crear un empleado. |
 | `/dashboard/employees/[id]/edit` | Editar un empleado existente. |
 | `/dashboard/departments` | Consultar y administrar departamentos. |
 | `/dashboard/departments/new` | Crear un departamento. |
 | `/dashboard/departments/[id]/edit` | Editar un departamento existente. |
 
 ## Build y despliegue
 
 Comprueba el proyecto antes de desplegarlo:
 
 ```bash
 npm run lint
 npm run build
 ```
 
 La aplicación está desplegada en [employees-frontend-cyan.vercel.app](https://employees-frontend-cyan.vercel.app/). Para nuevos despliegues, configura la URL de la API en las variables de entorno privadas del proveedor de hosting y ejecuta `npm run start`. El frontend puede desplegarse en Vercel o en cualquier plataforma compatible con Next.js.
 
 ## Notas de seguridad
 
 - No subas `.env.local` ni credenciales al repositorio.
 - El token de autenticación se almacena en una cookie HTTP-only.
 - Usa HTTPS en producción para proteger el tráfico y la cookie de sesión.
