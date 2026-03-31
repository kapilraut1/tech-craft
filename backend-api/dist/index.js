"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("./data.source");
const auth_route_1 = require("./routes/auth.route");
const property_route_1 = require("./routes/property.route");
const favourite_route_1 = require("./routes/favourite.route");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    app.use("/api/auth", auth_route_1.authRoute);
    app.use("/api/properties", property_route_1.propertyRoute);
    app.use("/api/favourite", favourite_route_1.favRoute);
    // Serve frontend for all non-API routes (SPA fallback)
    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
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
