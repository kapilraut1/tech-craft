"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favouriteService = void 0;
const data_source_1 = require("../data.source");
const favourite_entity_1 = require("../entities/favourite.entity");
const favouriteRepo = data_source_1.AppDataSource.getRepository(favourite_entity_1.Favourite);
async function toggleFavourite(userId, propertyId) {
    const existing = await favouriteRepo.findOne({
        where: { user: { id: userId }, property: { id: propertyId } },
    });
    if (existing) {
        await favouriteRepo.remove(existing);
        return { message: "Removed from favourites", isFavourite: false };
    }
    else {
        const newFav = favouriteRepo.create({
            user: { id: userId },
            property: { id: propertyId },
        });
        await favouriteRepo.save(newFav);
        return { message: "Added to favourites", isFavourite: true };
    }
}
async function getUserFavourites(userId) {
    const favourites = await favouriteRepo.find({
        where: { user: { id: userId } },
        relations: ["property"],
    });
    return favourites.map((f) => ({
        id: f.id,
        property: f.property,
    }));
}
exports.favouriteService = {
    toggleFavourite,
    getUserFavourites,
};
