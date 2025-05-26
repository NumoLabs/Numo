# Numo - Starknet BTC Yield Vault

Numo es una aplicación DeFi sobre Starknet que permite a los usuarios depositar BTC (o WBTC) y obtener rendimiento (“yield”) sin gestionar manualmente su estrategia. La vault mueve automáticamente los fondos entre plataformas DeFi como Vesu y Ekubo, buscando siempre el mejor APY disponible. Todo el yield se mantiene en BTC/WBTC, cumpliendo con los criterios del BTCfi Season Track.

## 🚀 Características Principales

### 🏦 Vault BTC/WBTC
- Depósito y retiro flexible de WBTC
- Exposición 100% en BTC/WBTC
- Yield siempre denominado en BTC/WBTC

### 🤖 Estrategia Automática y Manual
- **Modo Automático:** El contrato selecciona la mejor estrategia según datos de Pragma (APY, volatilidad, etc.)
- **Modo Manual:** El usuario elige en qué pool participar (Ekubo BTC/USDC, vaults de Vesu, etc.)
- **Modo Híbrido:** Distribución personalizada y rebalanceo automático solo entre pools seleccionados

### 🔄 Rebalanceo Inteligente
- Basado en condiciones de mercado y umbrales de APY
- Optimización para minimizar costos y slippage
- Conversión automática de recompensas a WBTC

### 📊 Dashboard y UX
- Visualización de APY, pools y estrategias
- Opciones sugeridas: "Mayor rendimiento", "Menor riesgo"
- Interfaz simple y amigable para cualquier usuario

## 🏗 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router)
- **Smart Contracts:** Cairo (StarkNet)
- **Oráculos:** Pragma
- **DeFi Integración:** Vesu, Ekubo
- **Estilos:** Tailwind CSS & shadcn/ui
- **Animaciones:** Framer Motion
- **Build:** Bun

## 📂 Estructura del Proyecto

```
Numo/
├── apps/
│   ├── webapp/
│   │   ├── app/            # Páginas App Router, layout, estado global, estilos
│   │   ├── components/     # Componentes React (ui/, home/, test/)
│   │   ├── constants/      # Constantes globales
│   │   ├── lib/            # Utilidades, helpers, cache, mock-data, schemas
│   │   ├── types/          # Tipos TypeScript compartidos
│   │   └── public/         # Assets estáticos
│   └── contracts/
│       ├── src/            # Código fuente Cairo
│       ├── tests/          # Pruebas de contratos
│       ├── Scarb.toml      # Configuración de Scarb
│       └── snfoundry.toml  # Configuración de pruebas
├── package.json
├── bun.lock
├── tsconfig.json
└── README.md
```

## 🏃 Comenzando

### Prerrequisitos

- Node.js (v18 o superior)
- Bun
- Git

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/your-username/numo.git
   cd numo
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

### Vault BTC Yield
- Usuarios que buscan rendimiento en BTC sin gestionar estrategias
- Delegación total o parcial de la estrategia de yield
- Retiro flexible y transparente

### Estrategia Personalizada
- Usuarios avanzados que desean elegir pools y definir rebalanceo
- Combinación de pools Ekubo y Vesu según preferencia

## 🔒 Seguridad

- Contratos auditados y open source
- Validación de direcciones y depósitos
- Protección contra ataques comunes DeFi
- Uso de oráculos robustos para decisiones de rebalanceo

## 📊 Comparativa de Características

| Característica           | Vault Tradicional | DeFi Manual | Numo Vault |
|-------------------------|-------------------|-------------|------------|
| Yield en BTC/WBTC       | ❌                | ⚠️          | ✅         |
| Estrategia Automática   | ❌                | ❌          | ✅         |
| Rebalanceo Inteligente  | ❌                | ❌          | ✅         |
| Integración Multi-Prot. | ❌                | ⚠️          | ✅         |
| UX Simple               | ✅                | ❌          | ✅         |
| Retiro Flexible         | ⚠️                | ✅          | ✅         |
| Open Source             | ⚠️                | ✅          | ✅         |

## 🔍 Criterios del BTCfi Track

| Requisito             | Cumplimiento                                 |
| --------------------- | -------------------------------------------- |
| Yield en BTC/WBTC     | ✅ Todas las recompensas se convierten a WBTC |
| Uso de Vesu/Ekubo     | ✅ Vault integra ambos protocolos             |
| Uso de Pragma         | ✅ Integración sofisticada de Pragma          |
| Uso de Starknet       | ✅ Desplegado en testnet Starknet             |
| Repositorio abierto   | ✅ Disponible en GitHub                       |
| Video demo            | ✅ Incluido                                   |
| Hilo explicativo en X | ✅ Incluye explicación técnica y menciones    |

## 📜 Licencia

Este proyecto es open source bajo la [MIT License](LICENSE).

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, revisa nuestras guías de contribución antes de enviar un pull request.

---

Desarrollado con ❤️ por el Equipo Numo
