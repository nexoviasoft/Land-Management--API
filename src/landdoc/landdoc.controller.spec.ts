import { Test, TestingModule } from '@nestjs/testing';
import { LanddocController } from './landdoc.controller';
import { LanddocService } from './landdoc.service';

describe('LanddocController', () => {
  let controller: LanddocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanddocController],
      providers: [LanddocService],
    }).compile();

    controller = module.get<LanddocController>(LanddocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
