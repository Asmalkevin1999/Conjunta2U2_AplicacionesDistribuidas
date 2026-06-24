import { Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FactoryVehiculos } from './factory/factory.vehiculo';

@Injectable()
export class VehiculosService {

  constructor(
    @InjectRepository(Vehiculo)
    private repositoryVehiculos:Repository<Vehiculo>
    
  ){}
  async create(createVehiculoDto: CreateVehiculoDto):Promise<Vehiculo> {
    const existe = await this.repositoryVehiculos.findOne({
      where:{
        placa:createVehiculoDto.datos.placa
      }
    });
    if(existe){
      throw new Error( " Ya existe un vehiculo con esa placa")
    }
    const vehiculo = FactoryVehiculos.crear(createVehiculoDto);
    return this.repositoryVehiculos.save(vehiculo);
  }

  async findAll(tipo?: string): Promise<Vehiculo[]> {
    const where: any = {};
    if (tipo) {
      const tipoMap: Record<string, string> = {
        auto: 'Auto',
        moto: 'Motocicleta',
        camioneta: 'Camioneta',
      };
      where.tipo = tipoMap[tipo.toLowerCase()];
    }
    return this.repositoryVehiculos.find({ where });
  }

  async findOne(id: string):Promise<Vehiculo> {
    const existe = await this.repositoryVehiculos.findOne({
      where:{
        id:id,
      }
    });
    if(!existe)throw new Error('Vehiculo no encontrado')
    return existe;
  }

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = await this.findOne(id);

    if (updateVehiculoDto.placa && updateVehiculoDto.placa !== vehiculo.placa) {
      const existe = await this.repositoryVehiculos.findOne({
        where: { placa: updateVehiculoDto.placa }
      });
      if (existe) {
        throw new Error(`El vehículo con placa ${updateVehiculoDto.placa} ya existe.`);
      }
    }
    Object.assign(vehiculo, updateVehiculoDto);

    return this.repositoryVehiculos.save(vehiculo);
  }

  async remove(id: string): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.repositoryVehiculos.remove(vehiculo);
  }
}
