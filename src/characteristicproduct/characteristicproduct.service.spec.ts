import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacteristicproductService } from './characteristicproduct.service';
import { CharacteristicproductEntity } from './characteristicproduct.entity/characteristicproduct.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CharacteristicproductService', () => {
  let service: CharacteristicproductService;
  let repository: Repository<CharacteristicproductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CharacteristicproductService],
    }).compile();

    service = module.get<CharacteristicproductService>(CharacteristicproductService);
    repository = module.get<Repository<CharacteristicproductEntity>>(getRepositoryToken(CharacteristicproductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
