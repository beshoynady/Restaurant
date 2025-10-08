const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const helmet = require("helmet"); // Security middleware
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

// Import database connection and route files
const connectdb = require("./database/connectdb.js");
const routeRestaurant = require("./router/restaurant.router.js");
const routePermission = require("./router/permission.router.js");
const routeAttendance = require("./router/attendance-record.router.js");
const routeShift = require("./router/shift.router.js");
const routePreparationSection = require("./router/preparation-section.router.js");
const routePreparationTicket = require("./router/preparation-ticket.router.js");
const routeDeliveryArea = require("./router/delivery-area.router.js");
const routeReservation = require("./router/reservation.router.js");
const routeMessage = require("./router/message.router.js");
const routeAuth = require("./router/auth.router.js");
const routeMenuCategory = require("./router/menu-category.router.js");
const routeProduct = require("./router/product.router.js");
const routeRecipe = require("./router/recipe.router.js");
const routeProductionRecipe = require("./router/production-recipe.router.js");
const routeUser = require("./router/user.router.js");
const routeCustomer = require("./router/customer.router.js");
const routeEmployee = require("./router/employee.router.js");
const routePayroll = require("./router/payroll.router.js");
const routeEmployeeTransactions = require("./router/employee-transactions.router.js");
const routeTable = require("./router/table.router.js");
const routeOrder = require("./router/order.router.js");
const routeCategoryStock = require("./router/category-stock.router.js");
const routeStockItems = require("./router/stock-item.router.js");
const routeSupplier = require("./router/supplier.router.js");
const routeSupplierTransaction = require("./router/supplier-transaction.router.js");
const routePurchase = require("./router/purchase.router.js");
const routePurchaseReturn = require("./router/purchase-return-invoice.router.js");
const routeStore = require("./router/store.router.js");
const routeStockMovement = require("./router/stock-movement.router.js");
const routeConsumption = require("./router/consumption.router.js");
const routeExpense = require("./router/expense.router.js");
const routeDailyExpense = require("./router/daily-expense.router.js");
const routeCashRegister = require("./router/cash-register.router.js");
const routeCashMovement = require("./router/cash-movement.router.js");
const routeProductionOrder = require("./router/production-order.router.js");
const routeProductionRecord = require("./router/production-record.router.js");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectdb();

const app = express();
const frontEnd = process.env.FRONT_END_URL;

// Security middleware
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
    contentSecurityPolicy: false,
  })
);

// Middleware setup
app.use(express.json({ limit: "100kb" })); // Limit request body size
app.use(cookieParser()); // Parse cookies

// CORS setup
const allowedOrigins = [
  "https://restaurant.menufy.tech",
  "https://www.restaurant.menufy.tech",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files
app.use("/", express.static("public"));
app.use("/images", express.static("images"));

// Simple test endpoint to check if the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // Limit each IP to 100 requests per window (1 minute)
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  trustProxy: false, // Disable trusting proxy headers
});
app.use("/api", limiter); // Apply rate limiting to all API routeS

// Route requests to appropriate routers
app.use("/api/restaurant", routeRestaurant);
app.use("/api/permission", routePermission);
app.use("/api/attendance", routeAttendance);
app.use("/api/shift", routeShift);
app.use("/api/preparationsection", routePreparationSection);
app.use("/api/preparationticket", routePreparationTicket);
app.use("/api/deliveryarea", routeDeliveryArea);
app.use("/api/product", routeProduct);
app.use("/api/recipe", routeRecipe);
app.use("/api/menucategory", routeMenuCategory);
app.use("/api/customer", routeCustomer);
app.use("/api/user", routeUser);
app.use("/api/employee", routeEmployee);
app.use("/api/message", routeMessage);
app.use("/api/payroll", routePayroll);
app.use("/api/employeetransactions", routeEmployeeTransactions);
app.use("/api/table", routeTable);
app.use("/api/order", routeOrder);
app.use("/api/auth", routeAuth);
app.use("/api/store", routeStore);
app.use("/api/categoryStock", routeCategoryStock);
app.use("/api/productionrecipe", routeProductionRecipe);
app.use("/api/stockitem", routeStockItems);
app.use("/api/supplier", routeSupplier);
app.use("/api/suppliertransaction", routeSupplierTransaction);
app.use("/api/purchaseinvoice", routePurchase);
app.use("/api/purchasereturn", routePurchaseReturn);
app.use("/api/stockmovement", routeStockMovement);
app.use("/api/consumption", routeConsumption);
app.use("/api/expenses", routeExpense);
app.use("/api/dailyexpense", routeDailyExpense);
app.use("/api/cashregister", routeCashRegister);
app.use("/api/cashMovement", routeCashMovement);
app.use("/api/reservation", routeReservation);
app.use("/api/productionorder", routeProductionOrder);
app.use("/api/productionrecord", routeProductionRecord);

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: ["https://restaurant.menufy.tech", "https://www.restaurant.menufy.tech"],
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Handle socket.io connections
// io.on('connect', (socket) => {
//

//   // Listen for new order notifications
//   socket.on('neworder', (notification) => {
//      // Confirm receipt
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('neworder', notification);
//   });
//   socket.on('orderkit', (notification) => {
//      // Confirm receipt
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('orderkit', notification);
//   });

//   socket.on('orderwaiter', (notification) => {
//      // Confirm receipt
//     // Emit the notification back to the client for testing purposes
//     socket.broadcast.emit('orderwaiter', notification);
//   });

//   // Handle disconnect event
//   socket.on('disconnect', () => {
//
//   });
// });

const cashierNamespace = io.of("/cashier");
const kitchenNamespace = io.of("/kitchen");
const BarNamespace = io.of("/bar");
const GrillNamespace = io.of("/grill");
const waiterNamespace = io.of("/waiter");

// التعامل مع اتصالات الكاشير
cashierNamespace.on("connection", (socket) => {
  // استقبال إشعار من العميل إلى الكاشير
  socket.on("neworder", (notification) => {
    // إرسال الإشعار إلى المطبخ
    cashierNamespace.emit("neworder", notification);
  });

  socket.on("disconnect", () => {});
});

// التعامل مع اتصالات المطبخ
kitchenNamespace.on("connection", (socket) => {
  socket.on("orderkitchen", (notification) => {
    kitchenNamespace.emit("orderkitchen", notification);
  });

  socket.on("disconnect", () => {});
});

BarNamespace.on("connection", (socket) => {
  socket.on("orderBar", (notification) => {
    BarNamespace.emit("orderBar", notification);
  });

  socket.on("disconnect", () => {});
});

GrillNamespace.on("connection", (socket) => {
  socket.on("orderGrill", (notification) => {
    GrillNamespace.emit("orderGrill", notification);
  });

  socket.on("disconnect", () => {});
});

// التعامل مع اتصالات الويتر
waiterNamespace.on("connection", (socket) => {
  socket.on("orderReady", (notification) => {
    waiterNamespace.emit("orderReady", notification);
  });
  socket.on("helprequest", (notification) => {
    waiterNamespace.emit("helprequest", notification);
  });

  socket.on("orderwaiter", (notification) => {
    waiterNamespace.emit("orderwaiter", notification);
  });

  socket.on("disconnect", () => {});
});

const port = process.env.PORT || 8000;

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});