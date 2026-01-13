# TetHealthGift

A MERN stack e-commerce platform for selling premium health gift baskets during the Tet (Lunar New Year) holiday season.

## Project Structure

This is a monorepo containing both the backend server and frontend client:

```
TetHealthGift/
├── server/           # Backend API (Node.js + Express + MongoDB)
│   ├── models/       # Mongoose models (Products, Orders, Categories)
│   ├── routes/       # API routes
│   └── server.js     # Main server file with DB connection
├── client/           # Frontend (React + Vite + Tailwind CSS)
│   └── src/          # React components and pages
└── README.md
```

## Tech Stack

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend (Client)
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TetHealthGift
   ```

2. **Set up the Server**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Set up the Client**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm run dev     # Development mode with nodemon
   # or
   npm start       # Production mode
   ```
   Server will run on `http://localhost:5000`

3. **Start the Frontend Client**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

## Database Models

### Product
- name, description, price
- category (reference to Category)
- images, stock, availability
- tags, weight, dimensions

### Category
- name, description
- image, active status

### Order
- orderNumber (auto-generated)
- customer info (name, email, phone, address)
- items (product references with quantity and price)
- totalAmount, status, payment details
- delivery information

## Environment Variables

Server `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tethealthgift
NODE_ENV=development
```

## Features

- RESTful API design
- MongoDB database with Mongoose ODM
- Complete CRUD operations for products, categories, and orders
- Automatic order number generation
- Responsive UI with Tailwind CSS
- Modern React with Vite for fast development

## Future Enhancements

- User authentication and authorization
- Image upload functionality
- Payment gateway integration
- Order tracking system
- Admin dashboard
- Email notifications
- Product search and filtering
- Shopping cart functionality

## License

ISC