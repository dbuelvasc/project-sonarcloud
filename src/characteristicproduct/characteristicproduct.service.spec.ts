import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicproductService } from './characteristicproduct.service';

describe('CharacteristicproductService', () => {
  let service: CharacteristicproductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharacteristicproductService],
    }).compile();

    service = module.get<CharacteristicproductService>(
      CharacteristicproductService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
