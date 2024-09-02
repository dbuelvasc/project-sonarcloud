import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCultureEntity } from './gastronomic-culture.entity/gastronomic-culture.entity';

describe('GastronomicCultureService', () => {
  let service: GastronomicCultureService;
  let repository: Repository<GastronomicCultureEntity>;
  let gastronomicCultureList: GastronomicCultureEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureService],
    }).compile();

    service = module.get<GastronomicCultureService>(GastronomicCultureService);
    repository = module.get<Repository<GastronomicCultureEntity>>(
      getRepositoryToken(GastronomicCultureEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    gastronomicCultureList = [];
    for (let i = 0; i < 5; i++) {
      const gastronomicCulture: GastronomicCultureEntity =
        await repository.save({
          name: faker.word.verb(),
        });
      gastronomicCultureList.push(gastronomicCulture);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all gastronomic cultures', async () => {
    const gastronomicCultures: GastronomicCultureEntity[] =
      await service.findAll();
    expect(gastronomicCultures).not.toBeNull();
    expect(gastronomicCultures).toHaveLength(gastronomicCultureList.length);
  });

  it('should return gastronomic culture by id', async () => {
    const storedGastronomicCulture: GastronomicCultureEntity =
      gastronomicCultureList[0];
    const gastronomicCulture: GastronomicCultureEntity = await service.findOne(
      storedGastronomicCulture.id,
    );
    expect(gastronomicCulture).not.toBeNull();
    expect(gastronomicCulture.name).toEqual(storedGastronomicCulture.name);
  });

  it('should throw an error when gastronomic culture with given id is not found', async () => {
    await expect(service.findOne('-1')).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('should create a gastronomic culture', async () => {
    const gastronomicCultureData = {
      name: faker.word.verb(),
      recipes: [],
      countries: [],
      restaurants: [],
      characteristicproducts: [],
    };

    const createdGastronomicCulture: GastronomicCultureEntity =
      await service.create(gastronomicCultureData);

    expect(createdGastronomicCulture).not.toBeNull();
    expect(createdGastronomicCulture.id).toBeDefined();
    expect(createdGastronomicCulture.name).toEqual(gastronomicCultureData.name);
  });

  it('should update a gastronomic culture', async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      gastronomicCultureList[0];
    gastronomicCulture.name = `${faker.word.verb()} NEW`;

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.update(gastronomicCulture.id, gastronomicCulture);
    expect(updatedGastronomicCulture).not.toBeNull();
    expect(updatedGastronomicCulture.name).toEqual(gastronomicCulture.name);
  });

  it('should throw an error when gastronomic culture with given id is not found', async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      gastronomicCultureList[0];
    gastronomicCulture.name = `${faker.company.name()} UPDATED`;

    await expect(
      service.update('-1', gastronomicCulture),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('should delete a gastronomic culture', async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      gastronomicCultureList[0];
    await service.delete(gastronomicCulture.id);

    const deletedGastronomicCulture: GastronomicCultureEntity =
      await repository.findOne({
        where: { id: gastronomicCulture.id },
      });
    expect(deletedGastronomicCulture).toBeNull();
  });

  it('should throw an error when gastronomic culture with given id is not found', async () => {
    await expect(service.delete('-1')).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
});
