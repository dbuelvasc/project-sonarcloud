import { faker } from "@faker-js/faker";
import { CacheModule } from "@nestjs/cache-manager";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RecipeEntity } from "@/recipe/recipe.entity";
import { GastronomicCultureEntity } from "@/gastronomicCulture/gastronomicCulture.entity";
import { TypeOrmTestingConfig } from "@/shared/testing-utils/typeorm-testing-config";
import { GastronomicCultureRecipeService } from "./gastronomicCulture-recipe.service";

describe("GastronomicCultureRecipeService", () => {
  let service: GastronomicCultureRecipeService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let recipeRepository: Repository<RecipeEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let recipesList: RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureRecipeService],
    }).compile();

    service = module.get<GastronomicCultureRecipeService>(
      GastronomicCultureRecipeService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));
    recipeRepository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recipeRepository.clear();
    gastronomicCultureRepository.clear();

    recipesList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await recipeRepository.save({
        name: faker.word.noun(),
        description: faker.lorem.paragraph(),
        photo: faker.internet.url(),
        preparationProcess: faker.lorem.paragraphs(),
        video: faker.internet.url(),
      });
      recipesList.push(recipe);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      recipes: recipesList,
    });
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should add a recipe to a gastronomic culture", async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
    });

    const result: GastronomicCultureEntity =
      await service.addRecipeToGastronomicCulture(
        gastronomicCulture.id,
        newRecipe.id,
      );

    expect(result.recipes.length).toBe(6);
    expect(result.recipes[5]).not.toBeNull();
    expect(result.recipes[5].name).toBe(newRecipe.name);
  });

  it("should throw an exception for an invalid recipe", async () => {
    await expect(
      service.addRecipeToGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
    });

    await expect(
      service.addRecipeToGastronomicCulture("0", newRecipe.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find recipes from a gastronomic culture", async () => {
    const recipes: RecipeEntity[] =
      await service.findRecipesFromGastronomicCulture(gastronomicCulture.id);
    expect(recipes.length).toBe(5);
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    await expect(
      service.findRecipesFromGastronomicCulture("0"),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should find a recipe from a gastronomic culture", async () => {
    const recipe: RecipeEntity = recipesList[0];
    const storedRecipe: RecipeEntity =
      await service.findRecipeFromGastronomicCulture(
        gastronomicCulture.id,
        recipe.id,
      );
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toBe(recipe.name);
  });

  it("should throw an exception for an invalid recipe", async () => {
    await expect(
      service.findRecipeFromGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const recipe: RecipeEntity = recipesList[0];
    await expect(
      service.findRecipeFromGastronomicCulture("0", recipe.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for a recipe not associated with the gastronomic culture", async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
    });

    await expect(
      service.findRecipeFromGastronomicCulture(
        gastronomicCulture.id,
        newRecipe.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product does not belong to the given gastronomic culture",
    );
  });

  it("should associate recipes to a gastronomic culture", async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateRecipeToGastronomicCulture(gastronomicCulture.id, [
        newRecipe,
      ]);
    expect(updatedGastronomicCulture.recipes.length).toBe(1);
    expect(updatedGastronomicCulture.recipes[0].name).toBe(newRecipe.name);
  });

  it("should throw an exception for a non-existing recipe", async () => {
    const newRecipe: RecipeEntity = recipesList[0];
    newRecipe.id = "a00e7840-77aa-4065-964a-d9e216eaf076";

    await expect(
      service.associateRecipeToGastronomicCulture(gastronomicCulture.id, [
        newRecipe,
      ]),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
    });

    await expect(
      service.associateRecipeToGastronomicCulture("0", [newRecipe]),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should delete a recipe from a gastronomic culture", async () => {
    const recipe: RecipeEntity = recipesList[0];

    await service.deleteRecipeFromGastronomicCulture(
      gastronomicCulture.id,
      recipe.id,
    );

    const storedGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.findOne({
        where: { id: gastronomicCulture.id },
        relations: ["recipes"],
      });
    const deletedRecipe = storedGastronomicCulture.recipes.find(
      (c) => c.id === recipe.id,
    );

    expect(deletedRecipe).toBeUndefined();
  });

  it("should throw an exception for an invalid recipe", async () => {
    await expect(
      service.deleteRecipeFromGastronomicCulture(gastronomicCulture.id, "0"),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id was not found",
    );
  });

  it("should throw an exception for an invalid gastronomic culture", async () => {
    const recipe: RecipeEntity = recipesList[0];
    await expect(
      service.deleteRecipeFromGastronomicCulture("0", recipe.id),
    ).rejects.toHaveProperty(
      "message",
      "The gastronomic culture with the given id was not found",
    );
  });

  it("should throw an exception for a non-associated recipe", async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      photo: faker.internet.url(),
      preparationProcess: faker.lorem.paragraphs(),
      video: faker.internet.url(),
    });

    await expect(
      service.deleteRecipeFromGastronomicCulture(
        gastronomicCulture.id,
        newRecipe.id,
      ),
    ).rejects.toHaveProperty(
      "message",
      "The characteristic product with the given id is not associated with the given gastronomic culture",
    );
  });
});
