import { AppDataSource } from "../data.source";
import { Property } from "../entities/property.entity";
import { Favourite } from "../entities/favourite.entity";

export interface Properties {
  title: string;
  price: number;
  image_url: string;
}
const propertyRepo = AppDataSource.getRepository(Property);
const favouriteRepo = AppDataSource.getRepository(Favourite);

async function getAllProperties(userId: number) {
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

async function addProperty(data: any) {
  const propertyRepo = AppDataSource.getRepository(Property);
  const property = propertyRepo.create(data);
  return await propertyRepo.save(property);
}

export const propertyService = {
  getAllProperties,
  addProperty,
};
