import { Response, Request } from "express";
import { propertyService } from "../services/property.service";
import { AuthRequest } from "./auth.controller";

const addProperties = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!req.body.title || !req.body.price) {
      return res.status(400).json({ error: "Title and price are required" });
    }
    const newProperty = await propertyService.addProperty({
      ...req.body,
      userId,
    });
    return res.status(201).json(newProperty);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getProperties = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const properties = await propertyService.getAllProperties(userId);
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const propertyController = {
  getProperties,
  addProperties,
};
