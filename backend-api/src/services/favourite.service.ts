import { AppDataSource } from "../data.source";
import { Property } from "../entities/property.entity";
import { Favourite } from "../entities/favourite.entity";
import { User } from "../entities/user.entity";

const favouriteRepo = AppDataSource.getRepository(Favourite);

async function toggleFavourite(userId: number, propertyId: number) {
  const existing = await favouriteRepo.findOne({
    where: { user: { id: userId }, property: { id: propertyId } },
  });

  if (existing) {
    await favouriteRepo.remove(existing);
    return { message: "Removed from favourites", isFavourite: false };
  } else {
    const newFav = favouriteRepo.create({
      user: { id: userId } as User,
      property: { id: propertyId } as Property,
    });
    await favouriteRepo.save(newFav);
    return { message: "Added to favourites", isFavourite: true };
  }
}

async function getUserFavourites(userId: number) {
  const favourites = await favouriteRepo.find({
    where: { user: { id: userId } },
    relations: ["property"],
  });

  return favourites.map((f) => ({
    id: f.id,
    property: f.property,
  }));
}

export const favouriteService = {
  toggleFavourite,
  getUserFavourites,
};
