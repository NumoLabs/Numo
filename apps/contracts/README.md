# PayStark - Contratos Inteligentes Cairo

Este directorio contiene los contratos inteligentes en Cairo que gestionan la lógica de pagos y APIs en Starknet.

## 📁 Estructura

```
contracts/
├── src/
│   ├── payment_gateway.cairo    # Contrato principal de pasarela de pagos
│   ├── api_endpoint.cairo       # Contrato para gestión de endpoints
│   └── interfaces/             # Interfaces y tipos compartidos
├── tests/                      # Tests de contratos
├── Scarb.toml                  # Configuración de Scarb
├── snfoundry.toml              # Herramienta de desarrollo y testing para contratos en StarkNet
└── README.md                   # Este archivo
```

## 🎯 Contratos Principales

### Payment Gateway (`payment_gateway.cairo`)
- Gestiona la lógica de pagos y transferencias
- Valida direcciones de wallet
- Maneja diferentes tipos de tokens (STRK, ERC20, etc.)

### API Endpoint (`api_endpoint.cairo`)
- Genera y gestiona endpoints únicos
- Almacena configuraciones de API
- Maneja la validación de permisos

## 🛠 Desarrollo

### Prerrequisitos

- [Scarb](https://docs.swmansion.com/scarb/) - Gestor de paquetes de Cairo
- [Starknet CLI](https://docs.starknet.io/documentation/tools/cli/) - Herramientas de desarrollo

### Compilación

```bash
scarb build
```

### Tests

```bash
scarb test
```

### Despliegue

```bash
starknet deploy --contract target/dev/paystark_payment_gateway.sierra.json
```

## 🔒 Seguridad

- Validación exhaustiva de inputs
- Manejo seguro de tokens
- Protección contra reentrancia
- Verificación de permisos

## 📝 Documentación

Para más detalles sobre la implementación y uso de los contratos, consulta la [documentación técnica](./docs/).

---

Desarrollado con ❤️ por el Equipo PayStark 