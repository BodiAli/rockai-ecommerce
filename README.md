# RockAi E-commerce

## Setup instructions (backend):

### Environment variables

<ul>
  <li>DATABASE_URL</li>
  <li>CLOUDINARY_URL</li>
</ul>

### Installation

```
cd backend
npm install
```

### Running server

```
npm run dev
```

### API guide

<ul>
  <li>GET /api/products Fetch all products</li>
  <li>GET /api/products/:id Get a single product</li>
  <li>POST /api/products Create a new product</li>
  <li>PUT /api/products/:id Update a product</li>
  <li>DELETE /api/products/:id Delete a product</li>
</ul>

GET http:localhost:3000/api/products

Expected response:

```json
[
  {
    "id": 1,
    "title": "Product 1",
    "price": 19.99,
    "description": "Short description",
    "image_url": "https://...",
    "cloudId": "id_example",
    "category": "Category",
    "created_at": "2025-08-10T12:00:00.000Z"
  }
]
```

GET http:localhost:3000/api/products/1

Expected response:

```json
{
  "id": 1,
  "title": "Product 1",
  "price": 19.99,
  "description": "Short description",
  "image_url": "https://...",
  "cloudId": "id_example",
  "category": "Category",
  "created_at": "2025-08-10T12:00:00.000Z"
}
```

POST http:localhost:3000/api/products

Expected response:

```json
{
  "msg": "Post created successfully!",
  "createdProduct": {
    "id": 1,
    "title": "Product 2",
    "price": 19.99,
    "description": "Short description 2",
    "image_url": "https://...",
    "cloudId": "id_example",
    "category": "Category",
    "created_at": "2025-08-10T12:00:00.000Z"
  }
}
```

PUT http:localhost:3000/api/products/2

Expected response:

```json
{
  "msg": "Product updated successfully!",
  "updatedProduct": {
    "id": 2,
    "title": "Product 2 updated",
    "price": 15,
    "description": "Short description 2 updated",
    "image_url": "https://... updated",
    "cloudId": "id_example",
    "category": "Category updated",
    "created_at": "2025-08-10T12:00:00.000Z"
  }
}
```

DELETE http:localhost:3000/api/products/2

Expected response:

```json
204 No Content
```

## Setup instructions (frontend):

### Installation

```
cd frontend
npm install
```

### Running app

```
npm run dev
```

## Architectural choices

Separation of concerns for backend and frontend

- Chose a modular structure
- Implemented MVC Design pattern for backend
- Implemented `localStorage` for cart page
- Created AdminUI to allow for content management
- Created error handling for UI and API responses
