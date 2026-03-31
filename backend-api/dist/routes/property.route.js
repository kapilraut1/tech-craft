"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyRoute = void 0;
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../controller/property.controller");
const auth_1 = require("../middleware/auth");
const propertyRoute = express_1.default.Router();
exports.propertyRoute = propertyRoute;
propertyRoute.get("/", auth_1.verifyToken, property_controller_1.propertyController.getProperties);
propertyRoute.post("/add", auth_1.verifyToken, property_controller_1.propertyController.addProperties);
