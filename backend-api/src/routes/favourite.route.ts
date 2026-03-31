import express from "express";
import { toggleFav, getMyFavourites } from "../controller/favourite.controller";
import { verifyToken } from "../middleware/auth";

const favRoute = express.Router();

favRoute.get("/", verifyToken, getMyFavourites);
favRoute.post("/:id/favourite", verifyToken, toggleFav);

export { favRoute };
