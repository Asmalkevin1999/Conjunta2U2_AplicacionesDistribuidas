import { Test, TestingModule } from '@nestjs/testing';
import { VehiculosService } from './vehiculos.service';
import { beforeEach, describe, it } from 'node:test';

describe('VehiculosService', () => {
  let service: VehiculosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiculosService],
    }).compile();

    service = module.get<VehiculosService>(VehiculosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
