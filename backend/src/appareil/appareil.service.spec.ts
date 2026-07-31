import { Test, TestingModule } from '@nestjs/testing';
import { AppareilService } from './appareil.service.js';

describe('AppareilService', () => {
  let service: AppareilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppareilService],
    }).compile();

    service = module.get<AppareilService>(AppareilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
