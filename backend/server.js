import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session" ;
import passport from "passport";
import "./controllers/authController.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js"; 
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import letterRoutes from "./routes/letterRoutes.js";
import {createClient} from "redis"

const app = new express();
const port = 3000;

redisClient = createClient({url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'});
redisClient.on("error", (error) => console.error("Redis Error", error));
redisClient.on("connect", () => console.log("Redis connected"));

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(
  session({
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("frontend"));
app.use(passport.initialize());
app.use(passport.session());

app.set("redis", redisClient);
app.use("/api",authRoutes);
app.use("/api",productRoutes);
app.use("/api", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api",stripeRoutes);
app.use("/api", letterRoutes);

(async () => {
    try {
        await redisClient.connect();
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start", err);
    }
})();