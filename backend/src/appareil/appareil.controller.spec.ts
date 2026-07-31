import { Test, TestingModule } from '@nestjs/testing';
import { AppareilController } from './appareil.controller.js';

describe('AppareilController', () => {
  let controller: AppareilController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppareilController],
    }).compile();

    controller = module.get<AppareilController>(AppareilController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
