# Prueba técnica – Productos (NestJS)

Backend construido con NestJS que expone información de productos financieros. La aplicación se levanta como **microservicio TCP** (no como servidor HTTP tradicional) y actualiza la información a partir de un mock en memoria.

## Descripción general

- **Framework:** NestJS + TypeScript.
- **Tipo de servicio:** microservicio basado en `Transport.TCP` escuchando en `127.0.0.1:4010` (`src/main.ts`).
- **Dominio:** productos/accounts de un usuario (cuentas, CDT, créditos, etc.) definidos en `src/products/products.mock.ts`.
- **Estado de los datos:** mock en memoria; no hay conexión a base de datos ni a otros servicios.

## Arquitectura

| Componente | Detalle |
| --- | --- |
| `src/main.ts` | Usa `NestFactory.createMicroservice` y deja al servicio escuchando mensajes TCP. |
| `AppModule` | Orquesta la aplicación importando `ProductsModule`. |
| `ProductsModule` | Registra un `ClientProxy` (`PRODUCTS_SERVICE`) apuntando al mismo microservicio TCP para permitir orquestaciones internas o desde otros módulos. |
| `ProductsController` | Expone rutas HTTP (`/products`) que devuelven el mock actual. Aunque el bootstrap es microservicio, estas rutas son útiles si se arranca la app como HTTP server en el futuro. |
| `ProductsService` | Define las llamadas a patrones `{ cmd: 'get_accounts' }`, `{ cmd: 'get_product_by_id' }` y `{ cmd: 'get_products_by_user_id' }`. |

> Nota: hoy no existen `@MessagePattern` que procesen esos comandos. El mock se entrega directamente por HTTP y los patrones quedan listos para cuando se implemente la mensajería.

## Endpoints disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/products` | Lista todos los productos del mock. |
| `GET` | `/products/:id` | Busca un producto por `id`. |
| `GET` | `/products/by-user/:userId` | Filtra los productos asociados a un usuario. |

Estos endpoints leen directamente de `PRODUCTS_MOCK`. Si quieres consultarlos mientras la app corre como microservicio, puedes exponerlos ejecutando `NestFactory.create(AppModule)` de manera alternativa o montando un gateway HTTP que use el mismo módulo.

## Ejecución

```bash
npm install       # instala dependencias
npm run start     # levanta el microservicio TCP en 127.0.0.1:4010
npm run start:dev # modo watch
npm run start:prod
```

Como el arranque usa `createMicroservice`, la aplicación queda escuchando peticiones RPC/TCP. Si necesitas exponer HTTP simultáneamente, puedes crear un `main.http.ts` paralelo o ajustar `main.ts` para bootstrap dual (`create` + `connectMicroservice`).

## Tests

No hay pruebas personalizadas aún; `npm run test` ejecuta los ejemplos que genera NestJS por defecto. Para cubrir este dominio se recomienda agregar pruebas unitarias sobre `ProductsController` (validación de filtros) y pruebas de contrato para los futuros patrones de microservicio.

## Estructura principal

```
src/
├── app.controller.ts      # endpoint raíz
├── app.module.ts
├── app.service.ts
├── main.ts                # bootstrap como microservicio TCP
└── products/
    ├── products.controller.ts
    ├── products.mock.ts
    ├── products.module.ts
    └── products.service.ts
```

Con esto el README refleja el estado real del repositorio y aclara cómo está concebido el servicio.
