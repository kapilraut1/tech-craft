import { Response } from "express";
import { AuthRequest } from "./auth.controller";
import { favouriteService } from "../services/favourite.service";

export const toggleFav = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const propertyId = Number(req.params.id);

    if (!userId || !propertyId || isNaN(propertyId)) {
      return res.status(400).json({ error: "Invalid user or property ID" });
    }

    const result = await favouriteService.toggleFavourite(userId, propertyId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyFavourites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const favourites = await favouriteService.getUserFavourites(userId);
    res.json(favourites);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
