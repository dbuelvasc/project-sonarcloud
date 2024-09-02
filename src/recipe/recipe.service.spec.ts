import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity/recipe.entity';
import { RecipeService } from './recipe.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';


describe('RecipeService', () => {
  let service: RecipeService;  
  let repository: Repository<RecipeEntity>; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
