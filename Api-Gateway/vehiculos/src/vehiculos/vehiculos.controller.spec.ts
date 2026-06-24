import { Test, TestingModule } from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import { VehiculosController } from './vehiculos.controller';
import { VehiculosService } from './vehiculos.service';
import { beforeEach, describe, it } from 'node:test';

describe('VehiculosController', () => {
  let controller: VehiculosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiculosController],
      providers: [VehiculosService],
    }).compile();

    controller = module.get<VehiculosController>(VehiculosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
