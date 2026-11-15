# Marketplace REST API

A RESTful backend API for an online marketplace built with **Node.js, Express.js, MongoDB, and Mongoose**. The API allows customers to browse products, place orders, manage their accounts, and track their purchases.

## Features

### Customer Management
- Register new customers.
- Retrieve customer information.
- Update customer details.
- Delete customer accounts.
- Store customer passwords securely using password hashing.

### Product Management
- Create new products.
- Retrieve all available products.
- Retrieve a single product by ID.
- Update product information.
- Delete products.
- Manage product prices and stock quantities.

### Order Management
- Place orders containing multiple products.
- Validate customer and product information before placing orders.
- Check product availability before processing orders.
- Automatically deduct ordered quantities from product stock.
- Calculate the total order amount.
- Use MongoDB transactions to ensure stock updates and order creation succeed or fail together.
- Retrieve all orders and their associated customer and product information.
- Update order statuses.

## Technologies Used

- **Node.js** – JavaScript runtime environment.
- **Express.js** – Backend web application framework.
- **MongoDB Atlas** – Cloud-based NoSQL database.
- **Mongoose** – MongoDB object data modeling (ODM) library.
- **bcrypt** – Password hashing.

## Project Structure

```text
Marketplace-API/
│
├── controllers/
│   ├── customerController.js
│   ├── productController.js
│   └── orderController.js
│
├── models/
│   ├── customerModel.js
│   ├── productModel.js
│   └── orderModel.js
│
├── routes/
│   ├── customerRoute.js
│   ├── productRoute.js
│   └── orderRoute.js
│
├── db.js
├── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sammy206015/MarketPlace-Api.git
```

### 2. Navigate into the project directory

```bash
cd Marketplace-API
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
MONGO_URL=your_mongodb_connection_string

```

Replace `your_mongodb_connection_string` with your MongoDB Atlas connection string.

### 5. Start the server

For normal execution:

```bash
node index.js
```

If Nodemon is installed:

```bash
npx nodemon index.js
```

The API will run at:

```text
http://localhost:3030
```

## API Endpoints

All endpoints accept and return JSON unless otherwise specified.

### Customer Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers/register` | Register a customer |
| GET | `/customers/getAll` | Retrieve all customers |
| GET | `/customers/:id/orders` | Retrieve Customers Order |
| GET | `/customers/get/:id` | Retrieve a customer by ID |
| PATCH | `/customers/update/:id` | Update customer information |
| DELETE | `/customers/delete/:id` | Delete a customer |

### Product Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products/create` | Create a product |
| GET | `/products/getAll` | Retrieve all products |
| GET | `/products/get/:id` | Retrieve a product by ID |
| PATCH | `/products/update/:id` | Update product information |
| DELETE | `/products/delete/:id` | Delete a product |

### Order Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/create` | Place a new order |
| GET | `/orders/getAll` | Retrieve all orders |
| GET | `/orders/get/:id` | Retrieve a single order |
| PATCH | `/orders/update-status/:id` | Update an order's status |

*Note: Update these endpoint paths if your actual Express route definitions use different paths.*

## Sample Request Bodies

### 1. Create a Customer

**POST** `/customers/register`

```json
{
    "firstName": "Samuel",
    "lastName": "Odeleye",
    "email": "samuel@example.com",
    "phoneNumber": "08012345678",
    "address": "Lagos, Nigeria",
    "password": "Password123"
}
```

### 2. Create a Product

**POST** `/products/create`

```json
{
    "productName": "HP EliteBook Laptop",
    "description": "Core i5 laptop with 8GB RAM and 256GB SSD",
    "price": 350000,
    "category": "Electronics",
    "quantity": 10
}
```

### 3. Place an Order

**POST** `/orders/create`

The API supports orders containing multiple products.

```json
{
    "customer": "CUSTOMER_ID",
    "products": [
        {
            "product": "PRODUCT_ID_1",
            "quantity": 2
        },
        {
            "product": "PRODUCT_ID_2",
            "quantity": 1
        }
    ]
}
```

The API automatically checks product availability, deducts the ordered quantities from stock, and calculates the total order amount.

### 4. Update Order Status

**PATCH** `/orders/update-status/ORDER_ID`

```json
{
    "orderStatus": "Processing"
}
```

Available order statuses:

- Pending
- Processing
- Shipped
- Delivered

## Order Processing and Stock Management

The order creation process uses MongoDB transactions to maintain data consistency.

When a customer places an order:

1. The API validates the customer ID and product information.
2. It checks whether the customer exists.
3. It verifies that each requested product exists.
4. It checks whether sufficient stock is available.
5. It deducts the requested quantities from product stock.
6. It calculates the total order amount.
7. It creates the order record.

If any operation fails, the transaction is rolled back to prevent incomplete orders or incorrect stock deductions.

## Testing

The API can be tested using **Postman** or any API testing client.

To test the endpoints:

1. Start the server.
2. Open Postman.
3. Enter the appropriate API endpoint.
4. Select the correct HTTP method.
5. For POST, PUT, and PATCH requests, select `Body → raw → JSON`.
6. Submit the request and inspect the response.

## Database

This project uses MongoDB Atlas to store customer, product, and order information.

The application uses Mongoose schemas and models to define the database structure and manage database operations.

## Author

**Backend Development Project**

Built with Node.js, Express.js, MongoDB, and Mongoose.