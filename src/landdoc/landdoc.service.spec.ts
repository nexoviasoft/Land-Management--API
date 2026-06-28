import { Test, TestingModule } from '@nestjs/testing';
import { LanddocService } from './landdoc.service';

describe('LanddocService', () => {
  let service: LanddocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LanddocService],
    }).compile();

    service = module.get<LanddocService>(LanddocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
