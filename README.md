# PayStark - Starknet Payment Gateway & API

PayStark es una aplicación minimalista y moderna que permite a los usuarios generar APIs personalizadas para recibir fondos en Starknet (STRK, tokens compatibles o BTC) y crear pasarelas de pago, todo sin necesidad de gestionar la complejidad de contratos inteligentes.

## 🚀 Características Principales

### 🔌 Conexión de Wallet
- Integración con wallets Starknet (Argent X, Braavos)
- Detección automática de APIs existentes
- Interfaz intuitiva para conexión

### 📡 API Personalizada
- Generación de endpoint único basado en wallet address
- Formato: `https://starkapi.io/api/recibir/[username]-[wallet]`
- Ideal para recibir pagos directos

### 💳 Pasarela de Pago
- Configuración de wallet destino
- Validación de direcciones Starknet
- Endpoint personalizable con parámetros adicionales
- Formato: `https://starkapi.io/api/pasarela/[username]-[wallet]?destino=[destino]`

### 📊 Dashboard
- Visualización de APIs generadas
- Documentación integrada para desarrolladores
- Resumen de transacciones (próximamente)
- Copia rápida de endpoints

## 🏗 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router)
- **Backend:** Supabase
- **Estilos:** Tailwind CSS & shadcn/ui
- **Animaciones:** Framer Motion
- **Smart Contracts:** Cairo (StarkNet)
- **Integración Wallet:** starknetkit
- **Despliegue:** Vercel

## 📂 Estructura del Proyecto

```
PayStark/
├── apps/
│   ├── webapp/             # Aplicación Next.js principal
│   │   ├── app/            # Páginas App Router
│   │   ├── components/     # Componentes React
│   │   ├── lib/           # Utilidades y helpers
│   │   └── public/        # Assets estáticos
│   └── contracts/         # Contratos inteligentes Cairo
├── services/              # Servicios backend
├── docs/                 # Documentación
└── package.json         # Dependencias principales
```

## 🏃 Comenzando

### Prerrequisitos

- Node.js (v18 o superior)
- Bun
- Git

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/your-username/paystark.git
   cd paystark
   ```

2. Instalar dependencias:
   ```bash
   bun install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.sample .env.local
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   bun dev
   ```

## 💡 Casos de Uso

### API Personalizada
- Creadores de contenido recibiendo tips en STRK
- Bots de Telegram/Webhooks para notificaciones de pago
- Formularios de donación Web3

### Pasarela de Pago
- Marketplaces dirigiendo pagos a wallets de vendedores
- Tiendas en línea integrando pagos en Starknet
- dApps procesando pagos a wallets específicas

## 🔒 Seguridad

- Validación de direcciones Starknet
- Protección contra ataques comunes
- Cumplimiento de regulaciones financieras
- Encriptación de datos sensibles

## 📊 Comparativa de Características

| Característica | APIs Básicas | Wallets | PayStark |
|----------------|-------------|---------|----------|
| API Personalizada | ❌ | ❌ | ✅ |
| Pasarela de Pago | ❌ | ❌ | ✅ |
| Validación de Wallet | ❌ | ✅ | ✅ |
| Documentación Integrada | ❌ | ❌ | ✅ |
| Interfaz Intuitiva | ⚠️ | ⚠️ | ✅ |
| Integración Fácil | ❌ | ❌ | ✅ |
| Parámetros Personalizables | ❌ | ❌ | ✅ |
| Soporte Multi-token | ⚠️ | ✅ | ✅ |

## 📜 Licencia

Este proyecto es open source bajo la [MIT License](LICENSE).

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, revisa nuestras guías de contribución antes de enviar un pull request.

---

Desarrollado con ❤️ por el Equipo PayStark
