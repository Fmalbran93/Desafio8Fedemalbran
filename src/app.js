// Importacion Dependencias
const express = require("express");
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require('path');
const passport = require("passport");
const winston = require("winston");

// Importacion Configuraciones
require("./database.js");
const initializePassport = require("./config/passport.config.js");
const configObject = require("./config/env.config.js");

// Importacion Middlewares
const auth = require("./middleware/authmiddleware.js");
const ErrorManager = require("./middleware/errorsMiddleware.js");
const brotliCompression = require("./middleware/brotlyCompression.js");
const addLogger = require("./middleware/loggerMiddleware.js");

// Importacion Socket
const SocketManager = require("./sockets/socketmanager.js");

// Importacion de rutas
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const testRouter = require("./routes/test.router.js");
const loggerRouter = require("./routes/logger.router.js");

// Configuracion express server
const app = express();
const PORT = configObject.server.port;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());
app.use(auth);
app.use(addLogger);
initializePassport();
brotliCompression();

// Configuracion Handlebars 
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/logger-test", loggerRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingProducts", testRouter);
app.use("/", viewsRouter);
app.use(ErrorManager);

// Socket Server
const httpServer = app.listen(PORT, () => {
    winston.info(`Server connected http://localhost:${PORT}`);
});

new SocketManager(httpServer);
