import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import indexRouter from "./routes/index.js";
import authRoutes from './app/auth/routes.js'
import categoryRoutes from './app/category/routes.js'
import postRoutes from './app/post/routes.js'

const app = express();

// Konfigurasi direktori tampilan dan mesin tampilan
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const corsOptions = {
  origin: [
    "http://localhost:5173", // local
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//main routes
app.use("/", indexRouter);
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/posts", postRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message

  if (err.code === 11000) {
    statusCode = 400
    message = "Email already exists"
  }

  if(req.accepts('html')){
    // set locals, only providing error in development
    res.locals.message = message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(statusCode);
    res.render("error");
  }

  res.status(statusCode).json({
    message,
    // show stack error only in development mode
    ...(req.app.get("env") === "development" && { stack: err.stack }),
  });
});

export default app;
