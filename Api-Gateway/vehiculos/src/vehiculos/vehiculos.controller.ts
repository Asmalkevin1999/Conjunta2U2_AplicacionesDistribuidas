import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiExtraModels } from '@nestjs/swagger';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto, AutoDto, MotoDto, CamionetaDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ResponseVehiculoDto } from './dto/response.vehiculo.dto';

@ApiTags('Vehículos')
@ApiExtraModels(AutoDto, MotoDto, CamionetaDto)
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un vehículo', description: 'Crea un auto, motocicleta o camioneta según el tipo especificado' })
  @ApiResponse({ status: 201, description: 'Vehículo creado exitosamente', type: ResponseVehiculoDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La placa ya existe' })
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vehículos', description: 'Obtiene todos los vehículos, opcionalmente filtrados por tipo' })
  @ApiQuery({ name: 'tipo', required: false, enum: ['auto', 'moto', 'camioneta'], description: 'Filtrar por tipo de vehículo' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos', type: [ResponseVehiculoDto] })
  findAll(@Query('tipo') tipo?: string) {
    return this.vehiculosService.findAll(tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un vehículo por ID' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado', type: ResponseVehiculoDto })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.vehiculosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un vehículo' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado', type: ResponseVehiculoDto })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  update(@Param('id') id: string, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(id, updateVehiculoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Vehículo eliminado' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  remove(@Param('id') id: string) {
    return this.vehiculosService.remove(id);
  }
}
