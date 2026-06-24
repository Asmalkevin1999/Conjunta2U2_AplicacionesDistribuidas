import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { IPersonsService } from './interfaces/persons-service.interface';
import { CreatePersonUseCase } from './use-cases/create-person.usecase';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { ResponsePersonDto } from './dto/response-person.dto';

@ApiTags('Personas')
@Controller('persons')
export class PersonsController {
  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
    @Inject('IPersonsService')
    private readonly personsService: IPersonsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una persona con su usuario' })
  @ApiResponse({
    status: 201,
    description: 'Persona y usuario creados exitosamente',
    type: ResponsePersonDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto: DNI, email o username ya existen',
  })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.createPersonUseCase.execute(createPersonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las personas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de personas',
    type: [ResponsePersonDto],
  })
  findAll() {
    return this.personsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una persona por ID' })
  @ApiResponse({
    status: 200,
    description: 'Persona encontrada',
    type: ResponsePersonDto,
  })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.personsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una persona' })
  @ApiResponse({
    status: 200,
    description: 'Persona actualizada',
    type: ResponsePersonDto,
  })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (soft delete) una persona' })
  @ApiResponse({ status: 200, description: 'Persona desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.personsService.softDelete(id);
  }
}
