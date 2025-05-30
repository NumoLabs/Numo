# Numo – Finanzas BTC Modulares en Starknet

## ✨ Descripción General

Numo es una plataforma DeFi modular construida sobre Starknet que permite a usuarios hacer crecer su BTC (WBTC) de manera segura, automática y transparente. Numo ofrece una experiencia completa centrada en BTC, incluyendo vaults de auto-rebalanceo, bonos a plazo fijo, compartición de estrategias, herramientas de pronóstico y una sección integrada de aprendizaje DeFi.

## 🚀 Características Principales

- **Depósito de WBTC**: Los usuarios pueden depositar WBTC en la vault de Numo.
- **Modo Automático y Manual**: Elige entre delegar la estrategia o seleccionar pools manualmente.
- **Rebalanceo Inteligente**: El contrato ajusta la estrategia según datos de Pragma (APY, volatilidad, etc.).
- **Integración Multi-Protocolo**: Utiliza Vesu y Ekubo para maximizar el rendimiento.
- **Yield en BTC/WBTC**: Todas las recompensas se convierten automáticamente a WBTC.
- **Retiro Flexible**: El usuario puede retirar su capital y yield en cualquier momento.
- **UI Simple y Amigable**: Experiencia pensada para usuarios sin experiencia en DeFi.
- **Bonos BTC**: Bloquea BTC por 7, 30 o 90 días para obtener yield extra.
- **Marketplace de Vaults**: Descubre y sigue estrategias creadas por la comunidad.
- **Herramientas de Pronóstico**: Simula ganancias y compara rendimientos.
- **Sección Educativa**: Aprende sobre DeFi directamente en la aplicación.

## 🏃 Comenzando

### Prerrequisitos

Asegúrate de tener instalado:

- [Node.js (v18 o superior)](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Clonar y Configurar

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/your-username/numo.git
   cd numo/apps/webapp
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

### Tecnologías y Protocolos

- **Starknet**: Blockchain L2 sobre Ethereum
- **Vesu**: Plataforma de préstamos y vaults descentralizados
- **Ekubo**: DEX con arquitectura AMM optimizada
- **Pragma**: Oráculo para precios en tiempo real y decisiones de rebalanceo
- **Cairo**: Lenguaje para los contratos inteligentes en Starknet
- **Next.js 14** con App Router
- **Tailwind CSS & shadcn/ui** para componentes modernos
- **Framer Motion** para animaciones fluidas
- **Optimización de Build** usando Bun

## 📊 Funcionamiento

1. El usuario deposita WBTC en el contrato de la vault.
2. Puede elegir entre tres modos:
   - **Modo Automático**: El contrato decide la mejor estrategia según datos de Pragma (APY, volatilidad, etc.).
   - **Modo Manual**: El usuario selecciona en cuál de los pools disponibles desea participar.
   - **Modo Híbrido**: Asignación personalizada + rebalanceo solo dentro de las estrategias seleccionadas.
3. El contrato consulta los oráculos de **Pragma** para obtener:
   - Precios actuales de BTC/USDC
   - Indicadores de mercado como volatilidad
   - APYs estimados en Vesu y Ekubo
4. La vault distribuye los fondos según la estrategia elegida:
   - ✨ Ekubo: proveer liquidez en pool BTC/USDC
   - ✨ Vesu: participar en vaults o préstamos con BTC
5. Cualquier recompensa generada en tokens distintos a BTC se convierte automáticamente a WBTC dentro del protocolo.
6. El usuario puede retirar sus fondos en cualquier momento junto con el rendimiento acumulado en WBTC.

## 🔄 Rebalanceo Automático

- Se ejecuta periódicamente o al alcanzar ciertos umbrales de cambio en el APY.
- Basado en condiciones del mercado obtenidas a través de Pragma.
- Puede optimizarse para minimizar costos y slippage.
- En el modo manual, el usuario puede definir una distribución fija o habilitar rebalanceo dentro de los pools seleccionados.

### 🎁 Bonus: modo híbrido

El usuario puede seleccionar múltiples pools manualmente (por ejemplo, 60% Ekubo, 40% Vesu) y habilitar el rebalanceo automático **solo dentro de esos pools elegidos**. Esto permite aprovechar automatización sin perder control.

## ❓ ¿Por qué es útil para usuarios sin experiencia en DeFi?

- Presenta estrategias con nombres y descripciones simples.
- Permite ver opciones sugeridas como "Mayor rendimiento" o "Menor riesgo".
- Evita que el usuario tenga que entender contratos o protocolos complejos.
- Permite delegar completamente las decisiones con el modo automático.

## 🔍 Criterios del BTCfi Track

| Requisito             | Cumplimiento                                 |
| --------------------- | -------------------------------------------- |
| Yield en BTC/WBTC     | ✅ Todas las recompensas se convierten a WBTC |
| Uso de Vesu/Ekubo     | ✅ Vault integra ambos protocolos             |
| Uso de Starknet       | ✅ Desplegado en testnet Starknet             |
| Repositorio abierto   | ✅ Disponible en GitHub                       |
| Video demo            | ✅ Incluido                                   |
| Hilo explicativo en X | ✅ Incluye explicación técnica y menciones    |
| Token de Representación| ✅ rbBTC como prueba de participación         |
| Bonos a Plazo Fijo    | ✅ Opciones de 7, 30 y 90 días                |

## ✏️ Futuras Expansiones

- Integración con nuevas estrategias (staking, NFTs con utilidad)
- Token de representación (`rbBTC`) para hacer composable la participación
- Dashboard analítico con APYs históricos y rebalanceos automáticos
- Sistema de recomendaciones en la UI basado en el perfil del usuario o estado del mercado

## 📜 Licencia

Este proyecto es open-source y está disponible bajo la [MIT License](LICENSE).

## 🚀 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de enviar pull requests o abrir issues.

---

Desarrollado con ❤️ por el Equipo Numo