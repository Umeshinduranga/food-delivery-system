# Food Delivery Management System

A Docker-based backend made of five independent Node.js microservices. Each service owns its own business logic, models, repositories, controllers, routes, Dockerfile, and `.dockerignore` file.

## Services

| Service | Responsibility | Port | Health check |
| --- | --- | ---: | --- |
| Auth Service | Registration, login, JWT authentication, roles | 5001 | `GET /health` |
| Restaurant Service | Restaurants and menu items | 5002 | `GET /health` |
| Order Service | Orders, items, totals, history, lifecycle | 5003 | `GET /health` |
| Delivery Service | Assignments, delivery status, timestamps | 5004 | `GET /health` |
| Customer Service | Profiles and delivery addresses | 5005 | `GET /health` |

The services are intentionally separate applications. No service imports another service's internal source files. The system does not include payment, notification, rider, or API gateway services.

## Project Structure

```text
food-delivery-system/
├── auth-service/
├── restaurant-service/
├── order-service/
├── delivery-service/
├── customer-service/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Requirements

- Docker Desktop with the Linux engine running
- Git
- Postman or another HTTP client for API testing

Node.js is only required when running a service outside Docker.

## Start the Complete System

Run these commands from the repository root:

```powershell
Copy-Item .env.example .env
docker compose build
docker compose up -d
docker compose ps
```

Compose creates these named containers:

```text
food-auth-service
food-restaurant-service
food-order-service
food-delivery-service
food-customer-service
```

Stop the system:

```powershell
docker compose down
```

View service logs:

```powershell
docker compose logs --tail=50
docker compose logs -f order-service
```

## Verify All Ports

PowerShell health check for every service:

```powershell
5001..5005 | ForEach-Object {
    $port = $_
    Invoke-RestMethod "http://localhost:$port/health"
}
```

Expected ports:

```text
Auth       http://localhost:5001
Restaurant http://localhost:5002
Order      http://localhost:5003
Delivery   http://localhost:5004
Customer   http://localhost:5005
```

## API Summary

All request bodies should use the header `Content-Type: application/json`.

### Auth Service: `http://localhost:5001`

```text
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
PATCH /api/auth/users/:id/status
```

### Restaurant Service: `http://localhost:5002`

```text
POST   /api/restaurants
GET    /api/restaurants
GET    /api/restaurants/:id
PATCH  /api/restaurants/:id
DELETE /api/restaurants/:id

POST   /api/restaurants/:restaurantId/menu-items
GET    /api/restaurants/:restaurantId/menu-items
GET    /api/restaurants/:restaurantId/menu-categories
PATCH  /api/menu-items/:itemId
DELETE /api/menu-items/:itemId
```

### Order Service: `http://localhost:5003`

```text
POST  /orders
GET   /orders/:orderId
GET   /customers/:customerId/orders
GET   /restaurants/:restaurantId/orders
PATCH /orders/:orderId/status
POST  /orders/:orderId/cancel
```

Example order request:

```json
{
  "customerId": "customer-1",
  "restaurantId": "restaurant-1",
  "deliveryAddress": "12 Main Street",
  "items": [
    {
      "menuItemId": "menu-1",
      "itemName": "Rice Bowl",
      "quantity": 2,
      "unitPrice": 1200
    }
  ]
}
```

Order statuses are `PENDING`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`, `PICKED_UP`, `ON_THE_WAY`, `DELIVERED`, and `CANCELLED`.

### Delivery Service: `http://localhost:5004`

```text
POST  /deliveries
GET   /deliveries/:deliveryId
GET   /delivery-persons/:deliveryPersonId/deliveries
PATCH /deliveries/:deliveryId/assign
PATCH /deliveries/:deliveryId/status
```

Delivery statuses are `PENDING`, `ASSIGNED`, `PICKUP_PENDING`, `PICKED_UP`, `ON_THE_WAY`, `DELIVERED`, `FAILED`, and `CANCELLED`.

### Customer Service: `http://localhost:5005`

```text
POST   /customers
GET    /customers/:customerId
PATCH  /customers/:customerId
DELETE /customers/:customerId

POST   /customers/:customerId/addresses
GET    /customers/:customerId/addresses
GET    /addresses/:addressId
PATCH  /addresses/:addressId
PUT    /addresses/:addressId/default
DELETE /addresses/:addressId
```

Example customer request:

```json
{
  "userId": "auth-user-1",
  "firstName": "Nimal",
  "lastName": "Perera",
  "phoneNumber": "0771234567"
}
```

## Docker Evidence

Use these commands when collecting practical-assignment evidence:

```powershell
docker compose build
docker compose up -d
docker compose ps
docker images
docker compose logs --tail=50
```

## Troubleshooting

Check that Docker Desktop is running:

```powershell
docker info
```

Check Compose syntax without starting containers:

```powershell
docker compose config
```

If a port is already in use, stop the existing Compose project:

```powershell
docker compose down
```

For a clean rebuild:

```powershell
docker compose down
docker compose build --no-cache
docker compose up -d
```
