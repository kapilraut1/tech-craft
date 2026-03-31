import express from "express";
import { propertyController } from "../controller/property.controller";
import { verifyToken } from "../middleware/auth";

const propertyRoute = express.Router();

propertyRoute.get("/", verifyToken, propertyController.getProperties);
propertyRoute.post("/add", verifyToken, propertyController.addProperties);

export { propertyRoute };
