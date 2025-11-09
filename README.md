# Prueba técnica – Productos (NestJS)

API HTTP construida con NestJS para exponer información ficticia de productos financieros. El backend arranca con `NestFactory.create(AppModule)`, habilita CORS y escucha por defecto en `http://localhost:3002` (puerto configurable mediante `PORT`).

## Descripción general

- **Framework:** NestJS + TypeScript.
- **Tipo de servicio:** servidor HTTP (no microservicio TCP).
- **Puerto:** `process.env.PORT ?? 3002`.
- **Dominio:** productos asociados a usuarios (Cuentas, CDT, créditos, fondos, etc.).
- **Datos:** mock en memoria (`src/products/products.mock.ts`), sin base de datos.

## Arquitectura

| Componente | Detalle |
| --- | --- |
| `src/main.ts` | Bootstrap HTTP, habilita CORS y levanta el servidor en el puerto configurado. |
| `AppModule` | Registra `AppController` y `ProductsModule`. |
| `ProductsModule` | Expone `ProductsController` y prepara un `ClientProxy` TCP (`PRODUCTS_SERVICE`) para futuras integraciones microservicio (`127.0.0.1:4010`). |
| `ProductsController` | Responde a `/products` leyendo directamente del mock (sin servicio intermedio). |
| `ProductsService` | Define métodos que enviarían mensajes `{ cmd: ... }` vía TCP; actualmente no es consumido. |
| `products.mock.ts` | Contiene 20 productos con `id`, `userId`, `balance`, `currency` y `type`. |

> Aunque existe la configuración de `ClientsModule`, en esta versión no hay `@MessagePattern` ni microservicios activos. Toda la funcionalidad publicada es HTTP.

## Endpoints disponibles

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Saludo básico (`AppController`). |
| `GET` | `/products` | Devuelve todo el mock de productos. |
| `GET` | `/products/:id` | Busca un producto por su `id`. |
| `GET` | `/products/by-user/:userId` | Filtra productos por `userId`. |

Las respuestas se generan al instante desde `PRODUCTS_MOCK` y no requieren autenticación.

## Ejecución

```bash
npm install
npm run start      # levanta en http://localhost:3002
npm run start:dev  # modo watch
npm run start:prod
```

## Tests

Nest trae comandos listos:

```bash
npm run test
npm run test:e2e
npm run test:cov
```

Aún no hay pruebas específicas para `ProductsController`. Se recomienda crear unit tests que validen filtros por `id` y `userId`, y añadir pruebas de contrato cuando el microservicio TCP esté implementado.

## Estructura principal

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
└── products/
    ├── products.controller.ts
    ├── products.mock.ts
    ├── products.module.ts
    └── products.service.ts
```

## Próximos pasos sugeridos

1. Consumir `ProductsService` desde el controlador o un caso de uso cuando exista una fuente remota real.
2. Implementar el microservicio TCP (o eliminar el `ClientsModule` si no se usará).
3. Extraer configuración (puertos, hosts) al `ConfigModule`.
4. Sustituir el mock por persistencia real y cubrir la lógica con pruebas unitarias/e2e.

Este README resume cómo está concebida la solución hoy y deja claros los elementos pendientes para evolucionarla.
