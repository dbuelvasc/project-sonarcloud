import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;
  let restaurantList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestaurantEntity = await repository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 1, max: 3 }),
        awardDate: faker.date.past(),
        gastronomicCulture: [],
      });
      restaurantList.push(restaurante);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Obtener todos los restaurantes', async () => {
    const restaurantes: RestaurantEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantList.length);
  });

  it('Obtener restaurante por id', async () => {
    const restauranteGuardado: RestaurantEntity = restaurantList[0];
    const restaurante: RestaurantEntity = await service.findOne(
      restauranteGuardado.id,
    );
    expect(restaurante).not.toBeNull();
    expect(restaurante.name).toEqual(restauranteGuardado.name);
    expect(restaurante.city).toEqual(restauranteGuardado.city);
  });

  it('Obtener restaurante con id invalido', async () => {
    await expect(service.findOne('-1')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('Crear un restaurante', async () => {
    const restauranteData = {
      name: faker.company.name(),
      city: faker.location.city() || 'Default City', // Asegurarse de que city no sea nulo
      michelinStars: faker.number.int({ min: 1, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCulture: [],
    };

    const nuevoRestaurante: RestaurantEntity =
      await service.create(restauranteData);

    expect(nuevoRestaurante).not.toBeNull();
    expect(nuevoRestaurante.id).toBeDefined();
    expect(nuevoRestaurante.name).toEqual(restauranteData.name);
    expect(nuevoRestaurante.city).toEqual(restauranteData.city);
  });

  it('Actualizar un restaurante', async () => {
    const restaurante: RestaurantEntity = restaurantList[0];
    restaurante.name = `${faker.company.name()} NEW`;
    restaurante.city = `${faker.location.city()} NEW`;

    const restauranteActualizado: RestaurantEntity = await service.update(
      restaurante.id,
      restaurante,
    );
    expect(restauranteActualizado).not.toBeNull();
    expect(restauranteActualizado.name).toEqual(restaurante.name);
    expect(restauranteActualizado.city).toEqual(restaurante.city);
  });

  it('Actualizar un restaurante con id invalido', async () => {
    const restaurante: RestaurantEntity = restaurantList[0];
    restaurante.name = `${faker.company.name()} UPDATED`;
    restaurante.city = `${faker.location.city()} UPDATED`;

    await expect(service.update('-1', restaurante)).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('Eliminar un restaurante', async () => {
    const restaurante: RestaurantEntity = restaurantList[0];
    await service.delete(restaurante.id);

    const restauranteEliminado: RestaurantEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(restauranteEliminado).toBeNull();
  });

  it('Eliminar un restaurante con id invalido', async () => {
    await expect(service.delete('-1')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});
