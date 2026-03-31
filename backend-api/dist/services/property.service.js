"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyService = void 0;
const data_source_1 = require("../data.source");
const property_entity_1 = require("../entities/property.entity");
const favourite_entity_1 = require("../entities/favourite.entity");
const propertyRepo = data_source_1.AppDataSource.getRepository(property_entity_1.Property);
const favouriteRepo = data_source_1.AppDataSource.getRepository(favourite_entity_1.Favourite);
async function getAllProperties(userId) {
    const properties = await propertyRepo.find();
    const userFavs = await favouriteRepo.find({
        where: { user: { id: userId } },
        relations: ["property"],
    });
    const favIds = new Set(userFavs.map((f) => f.property.id));
    return properties.map((p) => ({
        ...p,
        isFavourite: favIds.has(p.id),
    }));
}
async function addProperty(data) {
    const propertyRepo = data_source_1.AppDataSource.getRepository(property_entity_1.Property);
    const property = propertyRepo.create(data);
    return await propertyRepo.save(property);
}
exports.propertyService = {
    getAllProperties,
    addProperty,
};
