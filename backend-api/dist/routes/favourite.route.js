"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favRoute = void 0;
const express_1 = __importDefault(require("express"));
const favourite_controller_1 = require("../controller/favourite.controller");
const auth_1 = require("../middleware/auth");
const favRoute = express_1.default.Router();
exports.favRoute = favRoute;
favRoute.get("/", auth_1.verifyToken, favourite_controller_1.getMyFavourites);
favRoute.post("/:id/favourite", auth_1.verifyToken, favourite_controller_1.toggleFav);
