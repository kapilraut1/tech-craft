import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data.source";
import { authRoute } from "./routes/auth.route";
import { propertyRoute } from "./routes/property.route";
import { favRoute } from "./routes/favourite.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });

    app.use("/api/auth", authRoute);
    app.use("/api/properties", propertyRoute);
    app.use("/api/favourite", favRoute);

    app.get("{*path}", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
      }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
