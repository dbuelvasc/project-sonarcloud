import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('RecipeService', () => {
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let recipesList: RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recipesList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await repository.save({
        name: faker.word.noun(),
        description: faker.lorem.paragraph(),
        photo: faker.internet.url(),
        preparationProcess: faker.lorem.paragraphs(),
        video: faker.internet.url(),
      });
      recipesList.push(recipe);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recipes', async () => {
    const recipes: RecipeEntity[] = await service.findAll();
    expect(recipes).not.toBeNull();
    expect(recipes).toHaveLength(recipesList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedRecipe: RecipeEntity = recipesList[0];
    const recipe: RecipeEntity = await service.findOne(storedRecipe.id);
    expect(recipe).not.toBeNull();
    expect(recipe.name).toEqual(storedRecipe.name);
    expect(recipe.description).toEqual(storedRecipe.description);
    expect(recipe.photo).toEqual(storedRecipe.photo);
    expect(recipe.preparationProcess).toEqual(storedRecipe.preparationProcess);
    expect(recipe.video).toEqual(storedRecipe.video);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('create should return a new recipe', async () => {
    const recipe: RecipeEntity = {
      id: '0',
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      gastronomicCulture: null,
    };

    const newRecipe: RecipeEntity = await service.create(recipe);
    expect(newRecipe).not.toBeNull();

    const storedRecipe: RecipeEntity = await repository.findOne({
      where: { id: newRecipe.id },
    });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(newRecipe.name);
    expect(storedRecipe.description).toEqual(newRecipe.description);
    expect(storedRecipe.photo).toEqual(newRecipe.photo);
    expect(storedRecipe.preparationProcess).toEqual(
      newRecipe.preparationProcess,
    );
    expect(storedRecipe.video).toEqual(newRecipe.video);
  });

  it('update should modify a recipe', async () => {
    const recipe: RecipeEntity = recipesList[0];
    recipe.name = 'Wonderland';
    recipe.description = 'A wonderfull place';
    recipe.photo = 'https://www.LaReceta.com/foto1';
    recipe.preparationProcess = 'Paso 1, paso 2, paso 3';
    recipe.video = 'https://www.LaReceta.com/video1';

    const updatedRecipe: RecipeEntity = await service.update(recipe.id, recipe);
    expect(updatedRecipe).not.toBeNull();
    const storedRecipe: RecipeEntity = await repository.findOne({
      where: { id: recipe.id },
    });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(recipe.name);
    expect(storedRecipe.description).toEqual(recipe.description);
    expect(storedRecipe.photo).toEqual(recipe.photo);
    expect(storedRecipe.preparationProcess).toEqual(recipe.preparationProcess);
    expect(storedRecipe.video).toEqual(recipe.video);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let recipe: RecipeEntity = recipesList[0];
    recipe = {
      ...recipe,
      name: 'Wonderland 2',
      description: 'Another magic place',
      photo: 'https://www.LaReceta.com/foto12',
      preparationProcess: 'Paso 1, paso 2, paso 3, paso 3.1',
      video: 'https://www.LaReceta.com/video12',
    };
    await expect(() => service.update('0', recipe)).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('delete should remove a recipe', async () => {
    const recipe: RecipeEntity = recipesList[0];
    await service.delete(recipe.id);
    const deletedRecipe: RecipeEntity = await repository.findOne({
      where: { id: recipe.id },
    });
    expect(deletedRecipe).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });
});
