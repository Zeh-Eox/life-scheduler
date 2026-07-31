import { Test, TestingModule } from '@nestjs/testing';
import { CategorieService } from './categorie.service.js';

describe('CategorieService', () => {
  let service: CategorieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorieService],
    }).compile();

    service = module.get<CategorieService>(CategorieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
