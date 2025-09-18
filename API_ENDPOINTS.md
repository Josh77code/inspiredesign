# Digital Marketplace API Endpoints

## 🎯 **Public API Endpoints (No Authentication Required)**

### **Products API**
- **GET** `/api/products` - Get all products with filtering and pagination
  - Query params: `category`, `search`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `page`, `limit`
  - Example: `GET /api/products?category=logos&search=modern&page=1&limit=12`

- **GET** `/api/products/[id]` - Get a specific product by ID
  - Example: `GET /api/products/1`

- **POST** `/api/products` - Create a new product (for demo/admin)
  - Body: `{ title, price, category, artist, description, image?, tags? }`

- **PUT** `/api/products/[id]` - Update a product
  - Body: `{ title?, price?, category?, artist?, description?, image?, tags? }`

- **DELETE** `/api/products/[id]` - Delete a product
  - Example: `DELETE /api/products/1`

### **Orders API**
- **POST** `/api/orders` - Create a new order
  - Body: `{ items: [{ id, title, price, quantity, artist, image }], customerInfo: { email, name?, phone? }, totalAmount }`

- **GET** `/api/orders` - Get orders (with filtering)
  - Query params: `email`, `status`, `page`, `limit`

- **GET** `/api/orders/[id]` - Get a specific order
  - Example: `GET /api/orders/ORD-1234567890`

- **PUT** `/api/orders/[id]` - Update order status
  - Body: `{ status?, paymentStatus? }`

- **DELETE** `/api/orders/[id]` - Cancel an order
  - Example: `DELETE /api/orders/ORD-1234567890`

### **Contact API**
- **POST** `/api/contact` - Submit contact form
  - Body: `{ name, email, subject, message }`

- **GET** `/api/contact` - Get contact information
  - Returns: `{ email, phone, address, businessHours, socialMedia }`

## 🚀 **Example Usage**

### Fetch Products
```javascript
// Get all products
fetch('/api/products')

// Get products with filters
fetch('/api/products?category=logos&search=modern&page=1&limit=8')

// Get specific product
fetch('/api/products/1')
```

### Create Order
```javascript
const orderData = {
  items: [
    {
      id: 1,
      title: "Modern Logo Collection",
      price: 39.99,
      quantity: 1,
      artist: "Mike Chen",
      image: "/modern-minimalist-logo-designs.jpg"
    }
  ],
  customerInfo: {
    email: "customer@example.com",
    name: "John Doe"
  },
  totalAmount: 39.99
}

fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
})
```

### Submit Contact Form
```javascript
const contactData = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Inquiry about products",
  message: "I'm interested in your digital art collection..."
}

fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(contactData)
})
```

## 📝 **Response Format**

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🌐 **Server Status**

Your API is now running at:
- **Development**: `http://localhost:3001/api/`
- **Production**: `https://yourdomain.com/api/`

All endpoints are ready to use for your public digital marketplace!

