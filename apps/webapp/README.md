# PayStark - Next.js Application

PayStark es una aplicación minimalista y moderna que permite a los usuarios generar APIs personalizadas para recibir fondos en Starknet y crear pasarelas de pago, todo sin necesidad de gestionar la complejidad de contratos inteligentes.

## 🚀 Características Principales

- **Conexión de Wallet**: Integración con wallets Starknet (Argent X, Braavos)
- **API Personalizada**: Generación de endpoints únicos para recibir pagos
- **Pasarela de Pago**: Configuración de wallets destino para plataformas
- **Dashboard**: Visualización y gestión de APIs generadas
- **Documentación Integrada**: Guías para desarrolladores
- **Validación de Wallets**: Verificación automática de direcciones Starknet
- **Soporte Multi-token**: STRK, tokens compatibles y BTC

## 🏃 Comenzando

### Prerrequisitos

Asegúrate de tener instalado:

- [Node.js (v18 o superior)](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Clonar y Configurar

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/your-username/paystark.git
   cd paystark/apps/webapp
   ```

2. Instalar dependencias:

   ```bash
   bun install
   ```

3. Iniciar servidor de desarrollo:

   ```bash
   bun dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 🏗 Arquitectura

La aplicación web sigue un enfoque estructurado basado en componentes:

- **Componentes de Layout**: Estructura base del layout (`components/layout/`)
- **Componentes Compartidos**: Elementos UI reutilizables (`components/shared/`)
- **Componentes de Sección**: Secciones específicas de página (`components/sections/`)
- **Componentes UI**: Bloques básicos de UI (`components/ui/`)

### Características Técnicas

- **Next.js 14** con App Router
- **Supabase** para autenticación y almacenamiento
- **Integración Wallet** con starknetkit
- **Contratos Inteligentes** en Cairo
- **Tailwind CSS & shadcn/ui** para componentes modernos
- **Framer Motion** para animaciones fluidas
- **Optimización de Build** usando Bun

### Despliegue

La forma más sencilla de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## 📜 Licencia

Este proyecto es open-source y está disponible bajo la [MIT License](LICENSE).

## 🚀 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de enviar pull requests o abrir issues.

---

Desarrollado con ❤️ por el Equipo PayStark