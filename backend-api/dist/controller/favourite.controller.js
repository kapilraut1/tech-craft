"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFavourites = exports.toggleFav = void 0;
const favourite_service_1 = require("../services/favourite.service");
const toggleFav = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const propertyId = Number(req.params.id);
        if (!userId || !propertyId || isNaN(propertyId)) {
            return res.status(400).json({ error: "Invalid user or property ID" });
        }
        const result = await favourite_service_1.favouriteService.toggleFavourite(userId, propertyId);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.toggleFav = toggleFav;
const getMyFavourites = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const favourites = await favourite_service_1.favouriteService.getUserFavourites(userId);
        res.json(favourites);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMyFavourites = getMyFavourites;
