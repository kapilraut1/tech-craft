"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyController = void 0;
const property_service_1 = require("../services/property.service");
const addProperties = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!req.body.title || !req.body.price) {
            return res.status(400).json({ error: "Title and price are required" });
        }
        const newProperty = await property_service_1.propertyService.addProperty({
            ...req.body,
            userId,
        });
        return res.status(201).json(newProperty);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getProperties = async (req, res) => {
    try {
        const userId = Number(req.user?.id);
        const properties = await property_service_1.propertyService.getAllProperties(userId);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.propertyController = {
    getProperties,
    addProperties,
};
